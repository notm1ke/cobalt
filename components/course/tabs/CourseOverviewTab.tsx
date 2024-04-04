import { CompleteCoursePayload } from '@ilefa/husky';
import { MdiIcon, SessionNames, joinWithAnd } from '~/util';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import {
    mdiAccountClock,
    mdiAccountMultiple,
    mdiAlertCircle,
    mdiChairSchool,
    mdiFileDocument,
    mdiFinance,
    mdiListStatus,
    mdiMedal,
    mdiMonitor,
    mdiWeatherSunny
} from '@mdi/js';

export interface CourseOverviewTabProps {
    course: CompleteCoursePayload;
}

interface StatsCardProps {
    title: string;
    icon: JSX.Element;
    value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, icon, value }) => (
    <Card className="bg-white shadow-lg text-gray-700 border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">
                {title}
            </CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-gray-500">{value}</div>
        </CardContent>
    </Card>
)

export const CourseOverviewTab: React.FC<CourseOverviewTabProps> = ({ course }) => (
    <Card className="bg-white text-gray-700 p-3 rounded-t-none">
        <CardContent className="mt-5 mb-2">
            <div className="md:hidden mb-6">
                <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                    <MdiIcon path={mdiMonitor} size="21px" className="inline" />{" "}
                    View on Desktop
                </h2>

                <p className="leading-relaxed">
                    For the best experience, you should view this page on a desktop.
                </p>
            </div>

            {
                course.sections.length === 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                            <MdiIcon path={mdiAlertCircle} size="21px" className="inline" />{" "}
                            No sections available
                        </h2>

                        <p className="leading-relaxed">
                            This course is not currently being offered.
                        </p>
                    </div>
                )
            }

            {
                course.grading === 'Honors Credit' && (
                    <div className="mb-6">
                        <h2 className="text-lg text-red-400 font-bold font-mono mb-2">
                            <MdiIcon path={mdiMedal} size="21px" className="inline" />{" "}
                            Honors Credit
                        </h2>

                        <p className="leading-relaxed">
                            This course is typically enrolled in for honors credit.
                        </p>
                    </div>
                )
            }

            {
                course.sections.some(({ session }) => session !== 'Reg') && (
                    <div className="mb-6">
                        <h2 className="text-lg text-orange-400 font-bold font-mono mb-2">
                            <MdiIcon path={mdiWeatherSunny} size="21px" className="inline" />{" "}
                            Summer Sections
                        </h2>

                        <p className="leading-relaxed">
                            <b>{course.name}</b> is being offered during{" "}
                            <b>
                                {
                                    joinWithAnd(
                                        course
                                            .sections
                                            .filter(({ session }) => session !== 'Reg')
                                            .map(({ session }) => SessionNames[session as keyof typeof SessionNames] ?? session)
                                    )
                                }
                            </b>.
                        </p>
                    </div>
                )
            }

            <div className="mb-3">
                <h2 className="text-lg text-blue-400 font-bold font-mono mb-2">
                    <MdiIcon path={mdiFileDocument} size="21px" className="inline" />{" "}
                    Course Description
                </h2>

                <p className="leading-relaxed">
                    {course.description}
                </p>
            </div>

            <div className="mt-6">
                <h2 className="text-lg text-blue-400 font-bold font-mono mb-2">
                    <MdiIcon path={mdiListStatus} size="21px" className="inline" />{" "}
                    Prerequisites
                </h2>
                <p>{course.prerequisites}</p>
            </div>

            <div className="hidden md:flex mt-6">
                <h2 className="text-lg text-blue-400 font-bold font-mono mb-2">
                    <MdiIcon path={mdiFinance} size="21px" className="inline" />{" "}
                    Enrollment Metrics
                </h2>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4 mt-2">
                <StatsCard
                    title="Currently Enrolled"
                    icon={<MdiIcon path={mdiAccountMultiple}
                    size="25px"
                    className="inline" />}
                    value={
                        course
                            .sections
                            .flatMap(section => section.enrollment.current)
                            .reduce((acc, section) => acc + Number(section), 0)
                    }
                />

                <StatsCard
                    title="Currently Waitlisted"
                    icon={<MdiIcon path={mdiAccountClock}
                    size="25px"
                    className="inline" />}
                    value={
                        course
                            .sections
                            .flatMap(section => section.enrollment.waitlist ?? 0)
                            .reduce((acc, section) => acc + Number(section), 0)
                    }
                />

                <StatsCard
                    title="Open Seats"
                    icon={<MdiIcon path={mdiChairSchool}
                    size="25px"
                    className="inline" />}
                    value={
                        course
                            .sections
                            .flatMap(section => section.enrollment.max - section.enrollment.current)
                            .reduce((acc, section) => acc + Number(section), 0)
                    }
                />
            </div>
        </CardContent>
    </Card>
)