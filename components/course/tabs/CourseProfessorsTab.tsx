import moment from 'moment';

import { Card, CardContent } from '~/components/ui/card';
import { HTMLAttributes, useEffect, useState } from 'react';
import { CourseResolutionError, getRmpReports } from '~/lib/course';
import { CompleteCoursePayload, RmpGraphQlEdge, RmpRating, SectionData } from '@ilefa/husky';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTrigger
} from '~/components/ui/drawer';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '~/components/ui/pagination';

import {
    mdiArrowDown,
    mdiArrowRight,
    mdiArrowUp,
    mdiEmoticonFrown,
    mdiLink,
    mdiLoading,
    mdiMinus,
    mdiThumbDown,
    mdiThumbUp
} from '@mdi/js';

import {
    MdiIcon,
    MdiRepo,
    PickFunction,
    ProfessorReport,
    RmpTagCons,
    RmpTagPros,
    css,
    isCourseErrored,
    picker
} from '~/util';

export interface CourseProfessorsTabProps {
    course: CompleteCoursePayload;
}

const sortByRating = (a: ProfessorReport, b: ProfessorReport) => {
    if (!a.report || !a.report.numRatings) return 1;
    if (!b.report || !b.report.numRatings) return -1;
    if (a.report.avgRating === b.report.avgRating)
        return b.report.numRatings - a.report.numRatings;
    return b.report.avgRating - a.report.avgRating;
}

const renderStars = (num: number, classes?: string) => {
    let stars = [];
    let props = { size: '16px', className: css('inline', classes) }

    for (let i = 0; i < 5; i++) {
        let star = Math.min(num - i, 1);
        if (star >= 0.75) stars.push(<MdiIcon key={i} path={MdiRepo.mdiStar} {...props} />);
        else if (star >= 0.25) stars.push(<MdiIcon key={i} path={MdiRepo.mdiStarHalf} {...props} />);
        else stars.push(<MdiIcon key={i} path={MdiRepo.mdiStarOutline} {...props} />);
    }

    return stars;
}

const ratingsColor = (rating: number) => {
    let props = picker<number, HTMLAttributes<HTMLSpanElement>>([
        {
            pick: 4.5,
            value: () => ({ className: 'text-green-600 font-semibold' })
        },
        {
            pick: 3.75,
            value: () => ({ className: 'text-green-500 font-semibold' })
        },
        {
            pick: 3,
            value: () => ({ className: 'text-yellow-400 font-semibold' })
        },
        {
            pick: 2.5,
            value: () => ({ className: 'text-orange-400 font-semibold' })
        },
        {
            pick: 2.25,
            value: () => ({ className: 'text-red-400 font-semibold' })
        },
        {
            pick: 2.0,
            value: () => ({ className: 'text-red-600 font-semibold' })
        }
    ]);

    return props(rating);
}

const ratingIndicator = ({ report }: ProfessorReport) => {
    let props = ratingsColor(report?.avgRating ?? 0);
    if (!report || !report.avgRating || isNaN(report.avgRating)) return (
        <span>
            Not rated.{" "}
            <a href="https://ratemyprofessors.com" className="text-blue-400" target="_blank" rel="noopener noreferrer">
                Contribute <MdiIcon path={mdiArrowRight} size="16px" className="inline" />
            </a>
        </span>
    );

    return (
        <span>
            <span {...props}>
                {renderStars(report.avgRating)}
            </span> &bull; {report.numRatings} rating{report.numRatings === 1 ? '' : 's'}
        </span>
    );
}

const tagIndicator = (tag: string) => {
    let clean = tag.toLowerCase().trim();
    let element = picker<PickFunction<string>, JSX.Element>([
        {
            pick: input => RmpTagPros.includes(input),
            value: input => (
                <span className="text-green-400 font-semibold">
                    <MdiIcon path={mdiArrowUp} size="16px" className="inline" />{" "}
                    {input}
                </span>
            )
        },
        {
            pick: input => RmpTagCons.includes(input),
            value: input => (
                <span className="text-red-400 font-semibold">
                    <MdiIcon path={mdiArrowDown} size="16px" className="inline" />{" "}
                    {input}
                </span>
            )
        }
    ]);

    return element(clean) ?? (
        <span className="text-orange-400 font-semibold">
            <MdiIcon path={mdiMinus} size="16px" className="inline" />{" "}
            {clean}
        </span>
    );
}

const sortTags = (a: string, b: string) => {
    // sort pros first, then neither pro nor con (neutral), then cons
    let aClean = a.toLowerCase().trim();
    let bClean = b.toLowerCase().trim();
    let aIsPro = RmpTagPros.includes(aClean);
    let bIsPro = RmpTagPros.includes(bClean);
    let aIsCon = RmpTagCons.includes(aClean);
    let bIsCon = RmpTagCons.includes(bClean);

    if (aIsPro && !bIsPro) return -1;
    if (!aIsPro && bIsPro) return 1;
    if (!aIsPro && !bIsPro && !aIsCon && !bIsCon) return 0;
    if (aIsCon && !bIsCon) return -1;
    if (!aIsCon && bIsCon) return 1;
    
    return 0;
}

const filterSections = ({ section }: SectionData, lectures = true) => {
    let last = section.at(-1)!;
    return lectures
        ? !['L', 'D'].includes(last)
        : ['L', 'D'].includes(last);
}

const coalesceConsecutive = (sections: string[]) => {
    // sections will be 011L, 012L, 013L, 014L, 015L, 016L, 017L, 018L, 019L, 020L, 051L, 052L, 053L, combine the 011L-020L and 051L-053L to make the shortest representation
    let consecutive = [];
    let current = null;
    let last = null;
    for (let section of sections) {
        if (!current) {
            current = section;
            last = section;
            continue;
        }

        let currentNum = parseInt(current.slice(0, -1));
        let sectionNum = parseInt(section.slice(0, -1));
        if (sectionNum - currentNum === 1) {
            last = section;
            continue;
        }

        if (current === last) {
            consecutive.push(current);
        } else {
            consecutive.push(`${current}-${last}`);
        }

        current = section;
        last = section;
    }

    return consecutive;
}

const decodeProfessorId = (b64: string) => {
    let decoded = atob(b64);
    let [_, id] = decoded.split('-');
    return id;
}

const prettyRmpGrade = (grade: string) => {
    if (!grade || grade === 'Rather not say' || !/[abcdfABCDF](\+|-)*/.test(grade))
        return <></>;
    return <>Obtained {grade.toUpperCase()} &bull;</>;
}

export const ProfessorReviews: React.FC<{ ratings?: RmpGraphQlEdge<RmpRating> }> = ({ ratings }) => {
    const [page, setPage] = useState(0);

    if (!ratings?.edges || !ratings.edges.length) return (
        <div>
            <span className="italic">There are no ratings yet.</span>
        </div>
    );

    let pageSize = 1;
    let pageStart = page * pageSize;
    let pageEnd = pageStart + pageSize;

    let items = ratings
        .edges
        .sort((a, b) => new Date(b.node.date).getTime() - new Date(a.node.date).getTime())
        .slice(pageStart, pageEnd);

    const nextPage = () => {
        if ((page +  1) >= Math.ceil(ratings.edges.length / pageSize))
            return;
        setPage(page + 1);
    }

    const prevPage = () => {
        if (page === 0) return;
        setPage(page - 1);
    }

    console.log(items);

    return (
        <div>
            <ul className="list-none mb-5">
                {
                    items.map(({ node }, i) => (
                        <li key={i} className="my-2">
                            <span className="font-semibold">{moment(node.date).format('MMM Do, YYYY')}</span>{" "}
                            {renderStars(node.clarityRating, css('mt-[-5px]', ratingsColor((node.clarityRating + node.helpfulRating) / 2)?.className))}
                            <br /><span className="text-sm font-sans">{node.comment}</span>
                            {
                                node.ratingTags && (
                                    <>
                                        <br /><div className="mt-2">
                                            <ul>
                                                {
                                                    node.ratingTags.split('--').map((tag, i) => (
                                                        <li key={i}>
                                                            {tagIndicator(tag)}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </>
                                )
                            }
                            <div className="mt-3">
                                <span className="text-xs">
                                    {prettyRmpGrade(node.grade)}{" "}
                                    {node.isForCredit && <span>Taken for credit &bull; </span>}
                                    {node.thumbsUpTotal} <MdiIcon path={mdiThumbUp} size="14px" className="inline align-middle" />{" "}
                                    {node.thumbsDownTotal} <MdiIcon path={mdiThumbDown} size="14px" className="inline align-middle" />{" "}
                                </span>
                            </div>
                        </li>
                    ))
                }
            </ul>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={prevPage} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">
                            {page + 1}/{Math.ceil(ratings.edges.length / pageSize)}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" onClick={nextPage} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export const CourseProfessorsTab: React.FC<CourseProfessorsTabProps> = ({ course }) => {
    const [reports, setReports] = useState<ProfessorReport[] | CourseResolutionError>();

    useEffect(() => {
        if (!course.professors?.length) return;
        getRmpReports(course.professors)
            .then(setReports)
            .catch(() => setReports({
                message: 'An error occurred while fetching professors.'
            }));
    }, [course.professors]);

    if (!course.professors?.length) return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                        <MdiIcon path={mdiEmoticonFrown} size="21px" className="inline align-middle" />{" "}
                        There&apos;s nothing here
                    </h2>

                    <p className="leading-relaxed">
                        There are no professors for this course, are you sure it is being offered?
                    </p>
                </div>
            </CardContent>
        </Card>
    );
    
    if (isCourseErrored(reports)) return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                        <MdiIcon path={mdiEmoticonFrown} size="21px" className="inline align-middle" />{" "}
                        Oops, something went wrong
                    </h2>

                    <p className="leading-relaxed">
                        {reports.message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    if (!reports) return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <h2 className="text-lg text-blue-400 font-bold font-mono mb-2">
                        <MdiIcon path={mdiLoading} size="21px" className="inline align-middle" spin />{" "}
                        Loading..
                    </h2>
                </div>
            </CardContent>
        </Card>
    );
    
    return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <div className="m-0 p-0 list-none">
                        {
                            reports
                                .sort(sortByRating)
                                .map((record, i) => (
                                    <Drawer key={i}>
                                        <DrawerTrigger asChild>
                                            <li className="p-[20px] bg-white flex mb-[10px] rounded-[10px] cursor-pointer hover:bg-gray-100">
                                                <div className="text-[35px] w-[50px] h-[50px] mr-[30px] rounded-[50%] flex-shrink-0 ml-[-15px] pt-[0px]">
                                                    <MdiIcon path={MdiRepo[`mdiAlpha${record.name.at(0)}Circle`]} size="50px" className="text-blue-400 inline" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-center overflow-hidden pl-[20px] border-l-[1px] border-l-[#eee] border-solid text-gray-700">
                                                    <div className="flex flex-row gap-10 w-[100%]">
                                                        <p className="text-blue-400 font-semibold font-mono">{record.name}</p>
                                                    </div>

                                                    {ratingIndicator(record)}
                                                </div>
                                            </li>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <div className="mx-auto w-full max-w-[900px] p-3">
                                                <DrawerHeader>
                                                    <div className="font-bold font-mono text-xl">
                                                        {record.name}{" "}

                                                        {
                                                            record.report && (
                                                                <a
                                                                    className="text-blue-400"
                                                                    href={`https://www.ratemyprofessors.com/professor/${decodeProfessorId(record.report.id)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <MdiIcon path={mdiLink} size="23px" className="inline align-sub" />
                                                                </a>
                                                            )
                                                        }
                                                    </div>
                                                    <DrawerDescription>
                                                        {ratingIndicator(record)}
                                                    </DrawerDescription>
                                                </DrawerHeader>
                                                <div className="p-4">
                                                    {/* two cols, on mobile only one */}
                                                    <div className="flex flex-1 flex-col justify-center">
                                                        <div className="flex flex-row gap-10 w-full">
                                                            <div className="md:basis-1/2 sm:basis-full">
                                                                <span className="font-bold text-lg">Metrics</span>
                                                                {
                                                                    (!record.report || !record.report.avgRating || isNaN(record.report.avgRating)) && (
                                                                        <div>
                                                                            <span className="italic">There are no ratings yet.</span>
                                                                            <br /><span className="text-sm">Consider helping out the community by leaving one using the link above.</span>
                                                                        </div>
                                                                    )
                                                                }

                                                                {
                                                                    record.report && record.report.avgRating && !isNaN(record.report.avgRating) && (
                                                                        <>
                                                                            <p className="font-mono tracking-tight">
                                                                                <span className="font-semibold">{record.report.numRatings}</span> ratings
                                                                                {record.report.avgRating && <><br /><span className="font-semibold">{record.report.avgRating.toFixed(2)}</span> average rating</>}
                                                                                {record.report.avgDifficultyRounded && <><br /><span className="font-semibold">{record.report.avgDifficultyRounded.toFixed(2)}</span> average difficulty</>}
                                                                                {record.report.wouldTakeAgainPercent && <><br /><span className="font-semibold">{record.report.wouldTakeAgainPercent.toFixed(1)}%</span> would take again</>}
                                                                            </p>

                                                                            <div className="mt-6">
                                                                                <span className="font-bold text-lg">Tags</span>
                                                                                <p className="font-mono tracking-tight mt-2">
                                                                                    <ul className="list-none">
                                                                                        {
                                                                                            record
                                                                                                .report
                                                                                                .teacherRatingTags
                                                                                                .map(tag => tag.tagName)
                                                                                                .sort(sortTags)
                                                                                                .map((tag, i) => (
                                                                                                    <li key={i}>
                                                                                                        {tagIndicator(tag)}
                                                                                                    </li>
                                                                                                ))
                                                                                        }
                                                                                    </ul>
                                                                                </p>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="hidden md:flex md:basis-1/2">
                                                                <span className="font-bold text-lg">Teaching</span>
                                                                <div className="mt-2">
                                                                    <ul className="list-none">
                                                                        {/* only show lecture sections for main list */}
                                                                        {
                                                                            record
                                                                                .sections
                                                                                .filter(section => filterSections(section, true))
                                                                                .sort((a, b) => a.term.localeCompare(b.term))
                                                                                .map((section, i) => (
                                                                                    <li key={i}>
                                                                                        <span className="font-semibold">{section.term}</span> &bull; Section {section.section}
                                                                                    </li>
                                                                                ))
                                                                        }

                                                                        {/* show +N more (all others) */}
                                                                        <li className="cursor-pointer">
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                    <span className="font-mono text-sm">
                                                                                        +{record.sections.filter(section => filterSections(section, false)).length} more
                                                                                    </span>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        {coalesceConsecutive(record.sections.filter(section => filterSections(section, false)).map(({ section }) => section)).join(', ')}
                                                                                        <br />{record.sections.filter(section => filterSections(section, false)).map(({ section }) => section).join(', ')}
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                        </li>
                                                                    </ul>
                                                                </div>

                                                                <div className="mt-6">
                                                                    <span className="font-bold text-lg">Reviews</span>
                                                                    <p className="font-mono tracking-tight mt-2">
                                                                        <ProfessorReviews ratings={record.report?.ratings} />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <pre className="text-blue-400 pt-5">
                                                            {
                                                                JSON.stringify({
                                                                    ...record,
                                                                    sections: [],
                                                                    report: {
                                                                        ...record.report,
                                                                        ratings: record.report.ratings?.edges.slice(0, 1) ?? [],
                                                                        teacherRatingTags: [],
                                                                    }
                                                                }, null, 3)
                                                            }
                                                        </pre> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                ))
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}