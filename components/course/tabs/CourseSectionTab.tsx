import DataTable from 'react-data-table-component';

import { Button } from '~/components/ui/button';
import { TableColumn } from 'react-data-table-component';
import { Card, CardContent } from '~/components/ui/card';
import { CompleteCoursePayload, SectionData } from '@ilefa/husky';
import { mdiArrowRight, mdiBookInformationVariant, mdiChevronDown } from '@mdi/js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

import {
    MdiIcon,
    SessionNames,
    css,
    getCampusIndicator,
    getMeetingTime,
    getModalityIndicator,
    getRoomDisplayName,
    getTermCode,
    prunePrimitiveDuplicates,
    replaceAll,
    shortenName,
    shortenWithEllipses
} from '~/util';

export interface CourseSectionTabProps {
    course: CompleteCoursePayload;
}

const sanitizeInstructor = (instructor: string) => {
    if (!instructor || !instructor.trim().length)
        return 'Unknown';

    let copy = instructor.trim();
    copy = replaceAll(copy, /<br\/*>/, ' ');
    copy = replaceAll(copy, '&nbsp;', ' ');

    return copy;
}

const ExpandedDataComponent = ({ data }: { data: SectionData }) => (
    <div className="p-6 w-[100%]">
        <div className="m-0 p-0 list-none">
            <li className="p-[20px] bg-white flex mb-[10px] rounded-[10px]">
                <div className="text-[35px] w-[50px] h-[50px] mr-[30px] rounded-[50%] flex-shrink-0 ml-[-15px] pt-[0px]">
                    <MdiIcon path={mdiBookInformationVariant} size="50px" className="text-blue-400 inline" />
                </div>
                <div className="flex flex-1 flex-col justify-center overflow-hidden pl-[20px] border-l-[1px] border-l-[#eee] border-solid text-gray-700">
                    <div className="flex flex-row gap-10 w-[100%]">
                        <div className="basis-3/5">
                            <p className="font-bold text-blue-500">Section Information</p>
                            <p className="mt-2">
                                <span className="font-semibold">Section:</span> {data.section}
                                <br /><span className="font-semibold">Term:</span> {data.term}
                                <br /><span className="font-semibold">Campus:</span> {data.campus}
                                <br /><span className="font-semibold">Modality:</span> {data.mode}
                                <br /><span className="font-semibold">Instructor:</span> {sanitizeInstructor(data.instructor)}

                                {
                                    data.session !== 'Reg' && (
                                        <>
                                            <br /><span className="font-semibold">Session:</span> {SessionNames[data.session.toUpperCase() as keyof typeof SessionNames] ?? 'Unknown'}
                                        </>
                                    )
                                }
                            </p>

                            <p className="font-bold text-blue-500 mt-5">Meeting Information</p>
                            <p className="mt-1">
                                <span className="font-semibold">Schedule:</span> {prunePrimitiveDuplicates(getMeetingTime(data.schedule, data.location, undefined, undefined, true) as string[]).join(' & ')}
                                <br /><span className="font-semibold">Location:</span> {getRoomDisplayName(data)}
                            </p>
                        </div>
                        <div className="basis-2/5">
                            <p className="font-bold text-blue-500">Availability</p>
                            <p className="mt-1">
                                <span className="font-semibold">Current:</span> <span className={enrollmentColor(data.enrollment)}>{data.enrollment.current}/{data.enrollment.max}</span>
                                <br /><span className="font-semibold">Waitlist Spaces:</span> {data.enrollment.waitlist ?? 0}
                                <br /><span className="font-semibold">Filled:</span> {((data.enrollment.current / data.enrollment.max) * 100).toFixed(1)}%
                            </p>

                            <p className="font-bold text-blue-500 mt-7">Quick Enroll</p>
                            <p className="mt-1">
                                <span className="font-semibold">Class Number:</span> <span className="select-all text-blue-500">{data.internal.classNumber}</span>
                                <br /><span className="italic font-light">Copy the class number into StudentAdmin for one-click enrollment.</span>
                            </p>
                        </div>
                        <div className="basis-1/5">
                            <p className="font-bold text-blue-500">Links</p>
                            <Button variant="link" className="text-blue-400 ml-[-15px]" asChild>
                                <a href="https://student.studentadmin.uconn.edu/CSPR/signon.html" target="_blank" rel="noopener noreferrer">
                                    Student Admin{" "}
                                    <MdiIcon path={mdiArrowRight} size="16px" className="ml-0.5" />
                                </a>
                            </Button>
                            <Button variant="link" className="text-blue-400 ml-[-15px] mt-[-15px]" asChild>
                                <a href="https://uconn.collegescheduler.com" target="_blank" rel="noopener noreferrer">
                                    Schedule Builder{" "}
                                    <MdiIcon path={mdiArrowRight} size="16px" className="ml-0.5" />
                                </a>
                            </Button>
                            <Button variant="link" className="text-blue-400 ml-[-15px] mt-[-15px]" asChild>
                                <a href="https://catalog.uconn.edu" target="_blank" rel="noopener noreferrer">
                                    Course Catalog{" "}
                                    <MdiIcon path={mdiArrowRight} size="16px" className="ml-0.5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </li>
        </div>
    </div>
);

const semesterColor = (semester: string) => {
    let term = getTermCode(semester);
    switch (term) {
        case 'S': return 'text-green-600';
        case 'J': return 'text-orange-400';
        case 'F': return 'text-orange-600';
        case 'W': return 'text-blue-800';
        default: return '';
    }
}

const enrollmentColor = (enrollment: SectionData['enrollment']): string => {
    let current = parseInt(enrollment.current as any);
    let max = parseInt(enrollment.max as any);

    if (isNaN(current) || isNaN(max))
        return 'text-gray-700';
    if (current >= max)
        return 'text-red-500';
    if (current >= max * 0.75)
        return 'text-orange-600';
    return 'text-green-600';
}

const sectionIndicators = (section: SectionData, showTerms: boolean) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={css('font-mono font-bold tracking-tight', semesterColor(section.term))}>
                    [
                    {getCampusIndicator(section.campus)}/
                    {getModalityIndicator(section.mode)}
                    {
                        showTerms && `/${getTermCode(section.term)}${section.term.split(/(\d{2,4})/)[1].substring(2)}`
                    }
                    ]{" "}
                    <span className="font-medium font-sans text-gray-700">
                        {section.section}
                    </span>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <span className="font-bold">
                    {section.campus} Campus, {section.term}
                </span>

                <br />
                {section.mode}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const enrollmentIndicators = (section: SectionData) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={enrollmentColor(section.enrollment)}>
                    {section.enrollment.current}/{section.enrollment.max}
                    {section.enrollment.waitlist && (
                        <span className="font-mono font-semibold text-[0.56rem] align-top text-blue-600 ml-[2px]">
                            +{section.enrollment.waitlist}
                        </span>
                    )}
                    {/* {data.enrollment.waitlist && <span className={`${styles.extraRoomsIndicator} text-primary`}>+{data.enrollment.waitlist}</span>}{" "} */}
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <span>
                    <span className="font-bold">{section.enrollment.max}</span> seats
                    <br /><span className="font-bold">{section.enrollment.current}</span> enrolled
                    <br /><span className="font-bold">{section.enrollment.waitlist ?? 0}</span> waitlist spaces
                    <br /><span className="font-bold">{((section.enrollment.current / section.enrollment.max) * 100).toFixed(1)}%</span> filled
                </span>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const Columns = (showTerm: boolean): TableColumn<SectionData>[] => ([
    {
        id: 0,
        name: 'Section',
        selector: row => row.section,
        sortable: true,
        format: row => sectionIndicators(row, showTerm)
    },
    {
        id: 1,
        name: 'Room',
        selector: row => row.section,
        format: row => getRoomDisplayName(row),
    },
    {
        id: 2,
        name: 'Professor',
        selector: row => row.instructor,
        format: row => {
            let cleanName = row.instructor.trim();
            if (cleanName.length) {
                cleanName = replaceAll(cleanName, /<br\/*>/, ' ');
                cleanName = replaceAll(cleanName, '&nbsp;', ' ');
                cleanName = replaceAll(cleanName, /\(\w+\)/, '')
            }

            if (!cleanName.length)
                cleanName = 'Unknown';

            let display = <>{cleanName}</>;
            if (cleanName.split(' & ').length > 1)
                display = <>{shortenWithEllipses(cleanName.split(' & ')[0], 15)} <span className="align-top text-[0.525rem] font-mono">{'+' + (cleanName.split(' & ').length - 1)}</span></>;
            else if (cleanName.length > 20)
                display = <>{shortenName(cleanName, 22)}</>;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{display}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {
                                row.instructor.trim() && cleanName
                                    .split(' & ')
                                    .sort((a: string, b: string) => a.localeCompare(b))
                                    .map((name: string) => <><span>{name}</span><br /></>)
                            }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
    {
        id: 3,
        name: 'Schedule',
        selector: row => row.schedule,
        format: row => {
            let tokens = getMeetingTime(row.schedule.trim(), row.location, false, undefined, true) as string[];
            if (tokens.join('') === 'No Meeting Time' || tokens.join('') === 'Unknown')
                return tokens;

            tokens = prunePrimitiveDuplicates(tokens);
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <>
                                {tokens[0]}{" "}
                                {tokens.length !== 1 && <span className="align-top text-[0.525rem] font-mono">{'+' + (tokens.length - 1)}</span>}
                            </>
                        </TooltipTrigger>
                        <TooltipContent>
                            {
                                (prunePrimitiveDuplicates(
                                    (getMeetingTime(row.schedule.trim(), row.location, false, undefined, false) as string)
                                        .split(' & '))
                                    .map((time, i, arr) => <><span className="text-[0.75rem]">{time}</span>{i !== arr.length - 1 ? <br /> : ''}</>))
                            }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
    {
        id: 4,
        // right: true,
        name: 'Enrollment',
        selector: row => row.section,
        format: row => enrollmentIndicators(row),
    }
]);

export const CourseSectionTab: React.FC<CourseSectionTabProps> = ({ course }) => {
    let showTerm = course.sections.some((section, i, arr) => section.term !== arr[0].term);

    return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-[-10px] mb-[-33px] mx-[-32px]">
                <DataTable
                    striped
                    highlightOnHover
                    pointerOnHover
                    expandableRows
                    expandOnRowClicked
                    expandableRowsComponent={ExpandedDataComponent}
                    pagination
                    paginationPerPage={25}
                    sortIcon={<MdiIcon path={mdiChevronDown} />}
                    columns={Columns(showTerm)}
                    data={course.sections}
                />
            </CardContent>
        </Card>
    );
}