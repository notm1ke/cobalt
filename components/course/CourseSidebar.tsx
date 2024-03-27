import { Card, CardContent } from '../ui/card';
import { MdiIcon, css, hasContentArea } from '~/util';
import { CompleteCoursePayload, ContentArea } from '@ilefa/husky';

import {
    mdiBookOpenVariant,
    mdiCheckAll,
    mdiCheckDecagram,
    mdiCloseBox,
    mdiFlag
} from '@mdi/js';

export interface CourseSidebarProps {
    course: CompleteCoursePayload;
}

type SidebarEntry = {
    icon: JSX.Element;
    name: string;
    marginTop?: string;
    contents: SidebarEntryContents[];
}

type SidebarEntryContents = {
    name: string;
    value: string | number | JSX.Element;
}

const getSidebarInfo = (data: CompleteCoursePayload): SidebarEntry[] => [
    {
        icon: <MdiIcon path={mdiBookOpenVariant} size="20px" className="inline align-text-top" />,
        name: 'Overview',
        marginTop: '0',
        contents: [
            {
                name: 'Grading Type',
                value: data.grading
            },
            {
                name: 'Credits',
                value: data.credits ? data.credits + '.0' : 'Unknown'
            },
            {
                name: 'Campuses',
                value: [...new Set(data.sections.map(section => section.campus))].length + '/5'
            },
            {
                name: 'Sections',
                value: data.sections.length
            },
            {
                name: 'Professors',
                value: [
                            ...new Set(data
                            .sections
                            .map(section => section.instructor.trim())
                            .filter(prof => !prof.includes(','))
                            .filter(prof => !!prof))
                        ].length
            }
        ]
    },
    {
        icon: <MdiIcon path={mdiFlag} size="20px" className="inline align-text-top" />,
        name: 'Content Areas',
        contents: [
            {
                name: '(CA1) Arts and Humanities',
                value: generateBoolBadge(hasContentArea(data, ContentArea.CA1))
            },
            {
                name: '(CA2) Social Sciences',
                value: generateBoolBadge(hasContentArea(data, ContentArea.CA2))
            },
            {
                name: '(CA3) Science and Tech',
                value: generateBoolBadge(hasContentArea(data, ContentArea.CA3))
            },
            {
                name: '(CA4) Div & Multicultural',
                value: generateBoolBadge(hasContentArea(data, ContentArea.CA4))
            },
            {
                name: '(CA4INT) International',
                value: generateBoolBadge(hasContentArea(data, ContentArea.CA4INT))
            },
        ]
    },
    {
        icon: <MdiIcon path={mdiCheckAll} size="20px" className="inline align-text-top" />,
        name: 'Competencies',
        contents: [
            {
                name: '(L) Laboratory',
                value: generateBoolBadge(data.attributes.lab)
            },
            {
                name: '(W) Writing',
                value: generateBoolBadge(data.attributes.writing)
            },
            {
                name: '(Q) Quantitative',
                value: generateBoolBadge(data.attributes.quantitative)
            },
            {
                name: '(E) Environmental',
                value: generateBoolBadge(data.attributes.environmental)
            }
        ]
    },
]

const generateBoolBadge = (value: boolean) => value
    ? <MdiIcon path={mdiCheckDecagram} size="20px" className="mr-1 text-green-600" />
    : <MdiIcon path={mdiCloseBox} size="20px" className="mr-1 text-red-400" />

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
    let entries = getSidebarInfo(course);

    return (
        <Card className="bg-white text-gray-700 pt-2">
            <CardContent>
                {
                    entries.map((entry, i, arr) => (
                        <div key={entry.name} className={css(i !== arr.length - 1 && 'mb-6', entry.marginTop ? 'mt-3' : `mt-${entry.marginTop}`)}>
                            <pre className="text-lg font-bold mb-2.5 text-blue-400 text-[15px]">{entry.icon} {entry.name}</pre>
                            <div className="grid gap-[0.35rem]">
                                {
                                    entry.contents.map(content => (
                                        <div key={content.name} className="flex text-[13px]">
                                            <div className="font-mono font-semibold whitespace-nowrap text-gray-700">
                                                <span>{content.name}</span>
                                            </div>
                                            <div className="flex flex-1 relative justify-center items-center border-b border-b-[#ccc] border-dotted mx-[7px] top-[-9px]"></div>
                                            <div className="tabular-nums text-gray-500">
                                                <span>{content.value}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    );
}