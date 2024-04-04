'use client';

import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { CourseSidebar } from './CourseSidebar';
import { CompleteCoursePayload } from '@ilefa/husky';
import { CourseEquivTab } from './tabs/CourseEquivTab';
import { CourseSectionTab } from './tabs/CourseSectionTab';
import { CourseOverviewTab } from './tabs/CourseOverviewTab';
import { CourseProfessorsTab } from './tabs/CourseProfessorsTab';
import { MdiIcon, getIconForCourse, isCourseErrored } from '~/util';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CourseResolutionError, tryUnsafeResolve } from '~/lib/course';

import {
    mdiAccountSupervisor,
    mdiBookOpenPageVariant,
    mdiMathCompass,
    mdiTransfer
} from '@mdi/js';

export interface CourseBootstrapProps {
    query: string;
}

type Tab = {
    name: string;
    icon: JSX.Element;
    key: string;
    target: any;
}

const TabRegistry: Tab[] = [
    {
        name: 'Overview',
        icon: <MdiIcon path={mdiBookOpenPageVariant} size="21px" className="inline align-text-top" />,
        key: 'overview',
        target: CourseOverviewTab,
    },
    {
        name: 'Sections',
        icon: <MdiIcon path={mdiMathCompass} size="21px" className="inline align-text-top" />,
        key: 'sections',
        target: CourseSectionTab,
    },
    {
        name: 'Professors',
        icon: <MdiIcon path={mdiAccountSupervisor} size="21px" className="inline align-text-top" />,
        key: 'professors',
        target: CourseProfessorsTab,
    },
    {
        name: 'Transfer',
        icon: <MdiIcon path={mdiTransfer} size="21px" className="inline align-text-top" />,
        key: 'transfer',
        target: CourseEquivTab,
    }
]

export const CourseBootstrap: React.FC<CourseBootstrapProps> = ({ query }) => {
    const [course, setCourse] = useState<CompleteCoursePayload | CourseResolutionError | undefined>();

    useEffect(() => {
        tryUnsafeResolve(query).then(setCourse);
    }, [query]);

    if (!course) return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[1200px] flex-col items-center mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <div className="grid grid-cols-2 gap-1">
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-[350px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[350px]" />
                            <Skeleton className="h-4 w-[300px]" />
                            <Skeleton className="h-4 w-[350px]" />
                            <Skeleton className="h-4 w-[330px]" />
                            <Skeleton className="h-4 w-[340px]" />
                            <Skeleton className="h-4 w-[300px]" />
                            <Skeleton className="h-4 w-[350px]" />
                            <Skeleton className="h-4 w-[330px]" />
                            <Skeleton className="h-4 w-[340px]" />
                            <Skeleton className="h-4 w-[300px]" />
                            <Skeleton className="h-4 w-[350px]" />
                            <Skeleton className="h-4 w-[330px]" />
                            <Skeleton className="h-4 w-[340px]" />
                            <Skeleton className="h-4 w-[300px]" />
                            <Skeleton className="h-4 w-[350px]" />
                            <Skeleton className="h-4 w-[330px]" />
                            <Skeleton className="h-4 w-[340px]" />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-6 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                        <Skeleton className="h-4 w-[750px] ml-[-135px]" />
                    </div>
                </div>
            </section>
        </div>
    );

    if (course && isCourseErrored(course)) return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                    Hmm, something went wrong
                </h1>
                <p className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                    {course.message ?? 'An unknown error occurred'}
                </p>
            </section>
        </div>
    );

    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                    {getIconForCourse(course.name, 'inline align-top', 40)} {course.name}
                </h1>
                <p className="max-w-[500px] text-center tracking-tight text-xl">
                    {course.catalogName}
                </p>
            </section>
            <section className="mx-auto flex flex-col items-center mt-3 py-8">
                <div className="flex flex-col gap-10 w-full md:flex-row">
                    <div className="md:w-1/4 sm:w-full space-y-3">
                        <CourseSidebar course={course} />
                    </div>
                    <div className="md:w-3/4 sm:w-full space-y-3">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="h-14 w-full rounded-b-none">
                                {
                                    TabRegistry.map(tab => (
                                        <TabsTrigger key={tab.key} value={tab.key}>
                                            <div className="flex items-center space-x-2 mx-4 h-6">
                                                {tab.icon}
                                                <span className="hidden md:inline">{tab.name}</span>
                                            </div>
                                        </TabsTrigger>
                                    ))
                                }
                            </TabsList>
                            {
                                TabRegistry.filter(tab => !!tab.target).map(tab => (
                                    <TabsContent value={tab.key} key={tab.key} className="mt-0">
                                        <tab.target course={course} />
                                    </TabsContent>
                                ))
                            }
                        </Tabs>
                    </div>
                </div>
            </section>
        </div>
    )
};