import { useEffect, useMemo, useState } from 'react';
import { CompleteCoursePayload } from '@ilefa/husky';
import { Card, CardContent } from '~/components/ui/card';
import { mdiEmoticonFrown, mdiLoading } from '@mdi/js';
import { MdiIcon, groupBy, isCourseErrored } from '~/util';
import { CourseResolutionError, getEquivalentCourses } from '~/lib/course';
import { SimpleExternalCourse, TransferableCourse } from '@ilefa/bluetrade';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

export interface CourseEquivTabProps {
    course: CompleteCoursePayload;
}

export const CourseEquivTab: React.FC<CourseEquivTabProps> = ({ course }) => {
    const [equiv, setEquiv] = useState<TransferableCourse | CourseResolutionError>();
    const memoized = useMemo(() => getEquivalentCourses(course), [course]);

    useEffect(() => {
        memoized.then(setEquiv);
    }, [memoized]);

    if (!equiv) return (
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
    )

    if (isCourseErrored(equiv)) return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                        <MdiIcon path={mdiEmoticonFrown} size="21px" className="inline align-middle" />{" "}
                        There&apos;s nothing here
                    </h2>

                    <p className="leading-relaxed">
                        {equiv.message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    let schools = groupBy<SimpleExternalCourse>(equiv.equivalent, 'school');

    return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <Accordion type="single" collapsible className="bg-white">
                        {
                            Object.keys(schools).map((school, i) => (
                                <AccordionItem value={school} key={i} className="border-b-0">
                                    <AccordionTrigger className="flex items-center justify-between w-full p-3 rounded-md">
                                        <div className="text-lg font-bold">{school}</div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul>
                                            {
                                                schools[school]
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((course, i) => (
                                                        <li key={i} className="px-3 py-1 list-none">
                                                            <span className="font-semibold font-mono">{course.name}</span>
                                                        </li>
                                                    ))
                                            }
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
}