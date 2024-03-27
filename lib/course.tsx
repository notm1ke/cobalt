'use server';

import { ProfessorReport, RmpReportWithId } from '~/util';
import { TransferableCourse, getEquiv } from '@ilefa/bluetrade';

import {
    COURSE_IDENTIFIER,
    CompleteCoursePayload,
    CourseAttributes,
    getMappingByAttribute,
    SearchParts,
    searchCourse,
    ProfessorData,
    getRmpReport,
    RmpReport
} from '@ilefa/husky';

export type CourseResolutionError = {
    message: string;
}

export const tryUnsafeResolve = async (name: string): Promise<CompleteCoursePayload | CourseResolutionError> => {
    if (!COURSE_IDENTIFIER.test(name)) return { message: 'Invalid course name' };
    
    let course = await searchCourse(name, 'any', false, [SearchParts.SECTIONS, SearchParts.PROFESSORS]);
    let mapping = getMappingByAttribute('name', name);
    if (!course || !mapping) return { message: 'Course not found' };

    let payload: CompleteCoursePayload = {
        name: mapping.name,
        catalogName: mapping.catalogName,
        catalogNumber: mapping.catalogNumber,
        attributes: mapping.attributes as CourseAttributes,
        grading: course.grading,
        credits: parseInt(course.credits),
        prerequisites: course.prereqs,
        description: course.description,
        sections: course.sections,
        professors: course.professors
    };

    return payload;
}

export const getRmpReports = async (professors: ProfessorData[]): Promise<ProfessorReport[]> => await Promise.all(
    professors
        .map(async ({ name, rmpIds, sections }) => ({
            name, sections,
            report: mergeRmpReports(await Promise.all(
                rmpIds.map(async id => ({
                    id, ...await getRmpReport(id)
                }))
            ))
        }))
)

const mergeRmpReports = (reports: Array<RmpReportWithId>) => {
    if (!reports || !reports.length) return undefined;
    if (reports.length === 1) return reports[0];

    let maxWeight = Math.max(...reports.map(f => f.numRatings));
    let merged = reports.reduce((acc, curr) => {
        let weight = (curr.numRatings / maxWeight) || 1;
        let keys = Object.keys(curr) as (keyof RmpReportWithId)[];
        for (let key of keys) {
            if (key === 'id') {
                continue;
            }

            if (key === 'numRatings') {
                if (!acc.numRatings) acc.numRatings = 0;
                acc.numRatings += curr.numRatings;
                continue;
            }

            if (key === 'ratings') {
                let localEdges = acc.ratings?.edges || [];
                let remoteEdges = curr.ratings?.edges || [];

                if (!acc.ratings) acc.ratings = { edges: [] };
                acc.ratings.edges = [...localEdges, ...remoteEdges];
                continue;
            }

            if (key === 'avgRating' || key === 'avgDifficultyRounded' || key === 'wouldTakeAgainPercent') {
                if (!curr[key] || curr[key] === -1) continue;
                if (!acc[key]) acc[key] = (curr[key] && curr[key] !== -1) ? curr[key] : 1;
                
                // if numRatings is unset, set it to the current report's
                if (!acc.numRatings && curr.numRatings)
                    acc.numRatings = curr.numRatings;
                
                if (key === 'avgRating')
                    acc[key] = (acc[key] * acc.numRatings + curr[key] * weight) / (acc.numRatings + weight);
                else {
                    // this other case is for percents
                }
                
                continue;
            }

            if (key === 'teacherRatingTags') {
                let localTags = acc.teacherRatingTags || [];
                let remoteTags = curr.teacherRatingTags || [];
                acc.teacherRatingTags = [...new Set([...localTags, ...remoteTags])];
                continue;
            }

            if (key === 'courseCodes') {
                let localCodes = acc.courseCodes || [];
                let remoteCodes = curr.courseCodes || [];
                acc.courseCodes = [...new Set([...localCodes, ...remoteCodes])];
                continue;
            }
        }
        
        return acc;
    }, {} as RmpReportWithId);

    // assign id from max weighted report or first report if fails
    let maxWeightedReport = reports.find(f => f.numRatings === maxWeight);
    if (maxWeightedReport) merged.id = maxWeightedReport.id;
    else merged.id = reports[0].id;

    return merged;
}

export const resolveRmpById = async (profId: string): Promise<RmpReport> => await getRmpReport(profId);

export const getEquivalentCourses = async (course: CompleteCoursePayload): Promise<TransferableCourse | CourseResolutionError> => {
    let equiv = getEquiv(course.name);
    if (!equiv) return { message: `There don't seem to be any equivalent courses for ${course.name}.` };
    return equiv;
}

