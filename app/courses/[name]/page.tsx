import { Metadata } from 'next';
import { isCourseErrored } from '~/util';
import { notFound } from 'next/navigation';
import { tryUnsafeResolve } from '~/lib/course';
import { CourseBootstrap } from '~/components/course/CourseBootstrap';

type CoursePageParams = {
    params: { name: string }
};

export async function generateMetadata({ params: { name } }: { params: { name: string } }): Promise<Metadata> {
    const course = await tryUnsafeResolve(name);
    if (!course || isCourseErrored(course)) return notFound();
    return { title: course.name, description: course.description };
}

const CoursePageRoot = ({ params: { name } }: CoursePageParams) => <CourseBootstrap query={name} />;

export default CoursePageRoot;