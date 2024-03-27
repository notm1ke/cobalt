import { Metadata } from 'next';
import { DiningBootstrap } from '~/components/dining/DiningBootstrap';

export const metadata: Metadata = {
    title: 'Dining',
    description: 'Explore dining halls and their offerings.'
};

const DiningPageRoot = () => <DiningBootstrap />;

export default DiningPageRoot;