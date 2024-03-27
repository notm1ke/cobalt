import { replaceAll } from '.';
import { CourseResolutionError } from '~/lib/course';

import {
    CompleteCoursePayload,
    ContentArea,
    CourseMapping,
    RmpReport,
    SectionData,
    SectionLocationData
} from '@ilefa/husky';

export const isCourseErrored = (resolution: any): resolution is CourseResolutionError => {
    if (!resolution) return false;
    return 'message' in resolution;
};

export type RmpReportWithId = RmpReport & { id: string };

export type ProfessorReport = {
    name: string;
    sections: SectionData[];
    report?: RmpReportWithId;
}

export enum Modalities {
    IP = 'All instruction occurs on specified days/times and in a specified physical location.',
    PR = 'All instruction occurs on specified days/times and at a specified physical location. Remote students will participate synchronously from another UConn campus or remote location as specified by the faculty member.',
    HB = 'A minimum of 50% of instruction occurs on specified days/times and in a specified physical location. This portion of the course will meet in person. The remainder of instruction is delivered remotely, either synchronously or asynchronously.',
    HL = 'Some instruction, but less than 50%, occurs on specified days/times and in a specified physical location. This portion of the course will meet in person. The remainder of instruction is delivered remotely, either synchronously or asynchronously.',
    OS = 'All instruction occurs remotely on specified meeting days/times.',
    OA = 'All instruction occurs asynchronously online and there are no specified meeting days/times.',
    OB = 'All instruction occurs online but requires a mix of remote synchronous (specified days/times) and asynchronous online learning.',
    SL = 'This mode indicates a service learning class, with instruction times and locations to be determined by the instructor.',
    AR = 'All instruction is delivered at times and locations determined by mutual agreement between the instructor and the student(s).'
}

export enum SessionNames {
    MAY = 'May Session',
    SS1 = 'Summer Session 1',
    SS2 = 'Summer Session 2',
    SSP = 'Summer Spanning',
    SDE = 'Summer Divergent (Early)',
    SDL = 'Summer Divergent (Late)',
    AS1 = 'Alternate Session 1',
    AS2 = 'Alternate Session 2',
}

export const RmpTagPros = [
    'gives good feedback',
    'respected',
    'accessible outside class',
    'inspirational',
    'clear grading criteria',
    'hilarious',
    'amazing lectures',
    'caring',
    'extra credit',
    'would take again',
    'tests? not many'
];

export const RmpTagCons = [
    'lots of homework',
    'get ready to read',
    'participation matters',
    'skip class? you won\'t pass.',
    'graded by few things',
    'test heavy',
    'beware of pop quizzes',
    'lecture heavy',
    'so many papers',
    'tough grader'
];

/**
 * Returns whether a given course name
 * should be a grad-level course.
 * 
 * @param prefix the prefix of the course
 * @param number the course catalog number
 */
export const isGradLevel = (prefix: string, number: number | string) => {
    if (typeof number === 'string')
        number = parseInt(number);
    if (prefix === 'PHRX' && number < 5199)
        return false;
    return number > 5000;
}

export const hasContentArea = (course: CourseMapping | CompleteCoursePayload, area: ContentArea) =>
    course
        .attributes
        .contentAreas
        .some(ca => ca === area);

/**
 * Removes duplicates from a primitive array.
 * @param arr the array to remove duplicates from
 */
export const prunePrimitiveDuplicates = (arr: any[]) => arr.filter((item, i, arr) => arr.indexOf(item) === i);

/**
 * Returns the term code for a given term.
 * @param term the term to get a code for
 */
export const getTermCode = (term: string) => {
    let season = term.split(' ')[0].toLowerCase();
    if (season === 'spring') return 'S';
    if (season === 'summer') return 'J';
    if (season === 'fall') return 'F';
    if (season === 'winter') return 'W';
    return term.substring(0, 1);
}

/**
 * Returns the campus indicator for the provided
 * campus string.
 * 
 * @param campus the campus string
 */
export const getCampusIndicator = (campus: string) => {
    campus = campus.toLowerCase();
    if (campus === 'storrs') return 'S';
    if (campus === 'hartford') return 'H';
    if (campus === 'stamford') return 'Z';
    if (campus === 'waterbury') return 'W';
    if (campus === 'off-campus') return 'O';

    // apparently the campus string contains a weird space character
    if (campus.replace(/\s/, '') === 'averypoint')
        return 'A';

    return '?';
}

/**
 * Returns the modality indicator for the provided
 * modality string.
 * 
 * @param modality the modality string
 */
export const getModalityIndicator = (modality: string) => {
    modality = modality.toLowerCase();
    if (modality === 'online' || modality === 'online asynchronous') return 'OA';
    if (modality === 'online blended') return 'OB';
    if (modality === 'online synchronous') return 'OS';
    if (modality === 'distance learning') return 'DL';
    if (modality === 'hybrid') return 'HB';
    if (modality === 'hybrid limited') return 'HL';
    if (modality === 'in person') return 'IP';
    if (modality === 'in person remote') return 'PR';
    if (modality === 'service learning') return 'SL';
    if (modality === 'by arrangement') return 'AR';
    
    return '??';
}

/**
 * Returns the display name for a given room.
 * @param row the section row to parse
 */
export const getRoomDisplayName = (row: SectionData): string | JSX.Element => {
    let rowData = { ...row, location: row.location.filter(ent => ent.name) };
    if (!rowData.location.length || (rowData.location.length === 1 && rowData.location[0].name === 'No Room Required - Online')) {
        if (rowData.mode === 'Online' || rowData.mode === 'Distance Learning')
            return 'None';
        return 'Unknown';
    }

    // special case for some wrongly formatted courses (for example ECE2001 offered in Hartford) :/
    let locations: string[] = [];
    rowData.location.forEach(ent => ent.name.split(/<br\/*>/).forEach(e => locations.push(e)));

    if (locations.length === 1 && locations[0].startsWith('Pending Dept Room'))
        return 'Pending';

    if (locations.length === 1 && locations[0].startsWith('No Room Required -'))
        return rowData.location[0].name.split(' - ')[1];

    if (rowData.schedule.includes('12:00am-12:00am'))
        return 'None';

    if (rowData.location.length === 1)
        return locations[0];

    return locations
        .map(name => getRealRoomCode(name, name.split(' ')[0]) + ' ' + name.split(' ')[1])
        .join(', ');
}

/**
 * Returns the real room code for a given string.
 * 
 * This exists since Husky currently has some invalid
 * data for the rooms specifically in STRSWW (Storrs Hall Widmer Wing)
 * and WH (Wood Hall).
 * 
 * @param room the room string
 * @param buildingCode the building code for the room
 */
export const getRealRoomCode = (room: string, buildingCode: string) => {
    let code = buildingCode;
    if (room.startsWith('CHM'))       code = 'CHEM';
    if (room.startsWith('STRSWW'))    code = 'STRSWW';
    if (room.startsWith('WH'))        code = 'WH';
    if (room.startsWith('Waterbury')) code = 'WTBY';

    return code;
}

/**
 * Returns a formatted meeting time for a course.
 * 
 * @param schedule the schedule payload provided for the course
 * @param location the location object for a course
 * @param showFirst [optional] only show the first meeting time
 * @param showFirstChar [optional] character to display if showFirst is true
 */
export const getMeetingTime = (schedule: string, location: SectionLocationData[], showFirst?: boolean, showFirstChar?: string, asArray?: boolean): string | string[] => {
    if (schedule === '12:00am‑12:00am')
        return asArray
            ? ['No Meeting Time']
            : 'No Meeting Time';

    if (schedule.trim().length) {
        const cleanTime = (schedule: string) => {
            let copy = schedule.trim();
            copy = replaceAll(copy, 'Mo', 'M');
            copy = replaceAll(copy, 'We', 'W');
            copy = replaceAll(copy, 'Fr', 'F');
            return copy;
        }

        let split = schedule.trim().split(/<br\/*>/);
        if (split.length === 1)
            if (asArray)
                return [cleanTime(split.join(''))];
            else return cleanTime(split.join(''));

        if (showFirst)
            return cleanTime(split[0]) + (showFirstChar || '*');

        let copy = schedule.trim();
        copy = replaceAll(copy, /<br\/*>/, ' & ');
        copy = cleanTime(copy);

        if (asArray)
            return copy.split(' & ');

        return copy;
    }

    if (location.every(ent => ent.name === 'No Room Required - Online'))
        return asArray
            ? ['No Meeting Time']
            : 'No Meeting Time';

    return asArray
        ? ['Unknown']
        : 'Unknown';
}