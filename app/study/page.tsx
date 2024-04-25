import { Metadata } from 'next';
import { StudyBootstrap } from '~/components/study/StudyBootstrap';

export const metadata: Metadata = {
    title: 'Study Spaces',
    description: 'Explore study spaces at UConn.'
};

const StudyPageRoot = () => <StudyBootstrap />;

export default StudyPageRoot;