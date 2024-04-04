import { Metadata } from 'next';
import { RecBootstrap } from '~/components/rec/RecBootstrap';

export const metadata: Metadata = {
    title: 'Rec Center',
    description: '<todo: add dynamic count>'
};

const RecPageRoot = () => <RecBootstrap />;

export default RecPageRoot;