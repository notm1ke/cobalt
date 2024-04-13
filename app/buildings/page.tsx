import { Metadata } from 'next';
import { BuildingsBootstrap } from '~/components/buildings/BuildingsBootstrap';

export const metadata: Metadata = {
    title: 'Buildings',
    description: 'Explore buildings across all of UConn\'s campuses.'
};

const BuildingsPageRoot = () => <BuildingsBootstrap />;

export default BuildingsPageRoot;