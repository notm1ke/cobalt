import { MdiIcon, SITE_LOGO } from '~/util';

import {
    mdiBed,
    mdiBookEducation,
    mdiBookOpenPageVariant,
    mdiCalendar,
    mdiHumanMaleBoard,
    mdiPowerSocketUs,
    mdiSilverwareForkKnife,
    mdiSourceBranch,
    mdiWeightLifter
} from '@mdi/js';

export type Route = {
    name: string;
    key: string;
    path: string;
    dropdown?: DropdownContent[];
}

export type DropdownContent = {
    name: string;
    key: string;
    description: string;
    icon?: JSX.Element;
    path: string;
    newTab?: boolean;
}

export type MobileRouteSection = {
    title: string;
    routes: MobileRoute[];
}

export type MobileRoute = {
    name: string;
    key: string;
    path: string;
}

export const MobileRoutes: MobileRouteSection[] = [
    {
        title: 'Academics',
        routes: [
            {
                name: 'Available Rooms',
                key: 'rooms',
                path: '/buildings/available'
            },
            {
                name: 'Courses',
                key: 'courses',
                path: '/courses'
            },
            {
                name: 'Study Spaces',
                key: 'study',
                path: '/study'
            }
        ]
    },
    {
        title: 'Campus Life',
        routes: [
            {
                name: 'Buildings',
                key: 'buildings',
                path: '/buildings'
            },
            {
                name: 'Dining',
                key: 'dining',
                path: '/dining'
            },
            {
                name: 'Recreation Center',
                key: 'rec',
                path: '/rec'
            },
            {
                name: 'Residential Life',
                key: 'dorms',
                path: '/dorms'
            }
        ]
    },
    {
        title: 'Resources',
        routes: [
            {
                name: 'All About Cobalt',
                key: 'about',
                path: '/about'
            },
            {
                name: 'Changelog',
                key: 'changelog',
                path: '/changelog'
            },
            {
                name: 'Service Status',
                key: 'status',
                path: '/changelog'
            }
        ]
    }
] 

export const Routes: Route[] = [
    {
        name: 'Home',
        key: 'home',
        path: '/'
    },
    {
        name: 'Academics',
        key: 'academics',
        path: '#',
        dropdown: [
            {
                name: 'Available Rooms',
                key: 'rooms',
                description: 'Find available rooms on campus.',
                path: '/buildings/available',
                icon: <MdiIcon path={mdiCalendar} size="21px" className="mr-1" />
            },
            {
                name: 'Courses',
                key: 'courses',
                description: 'Explore courses offered at UConn.',
                path: '/courses',
                icon: <MdiIcon path={mdiBookEducation} size="21px" className="mr-1" />
            },
            {
                name: 'Study Spaces',
                key: 'study',
                description: 'Find study spaces on campus.',
                path: '/study',
                icon: <MdiIcon path={mdiBookOpenPageVariant} size="21px" className="mr-1" />
            }
        ]
    },
    {
        name: 'Campus Life',
        key: 'campus',
        path: '#',
        dropdown: [
            {
                name: 'Buildings',
                key: 'buildings',
                description: 'Explore buildings are on campus.',
                icon: <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-1" />,
                path: '/buildings'
            },
            {
                name: 'Dining',
                key: 'dining',
                description: 'Explore dining hall menus.',
                path: '/dining',
                icon: <MdiIcon path={mdiSilverwareForkKnife} size="21px" className="mr-1" />
            },
            {
                name: 'Recreation Center',
                key: 'rec',
                description: 'Explore realtime info about the Rec.',
                path: '/rec',
                icon: <MdiIcon path={mdiWeightLifter} size="21px" className="mr-1" />
            },
            {
                name: 'Residential Life',
                key: 'dorms',
                description: 'Explore res-halls and see their rooms.',
                path: '/dorms',
                icon: <MdiIcon path={mdiBed} size="21px" className="mr-1" />
            },
            
        ]
    },
    {
        name: 'Resources',
        key: 'resources',
        path: '#',
        dropdown: [
            {
                name: 'All About Cobalt',
                key: 'about',
                description: 'Learn more about Cobalt.',
                path: '/about',
                icon: <MdiIcon path={SITE_LOGO} size="21px" className="mr-1" />
            },
            {
                name: 'Changelog',
                key: 'changelog',
                description: 'See what\'s new with Cobalt.',
                path: '/changelog',
                icon: <MdiIcon path={mdiSourceBranch} size="21px" className="mr-1" />
            },
            {
                name: 'Service Status',
                key: 'status',
                description: 'Check the status of UConn services.',
                path: '/changelog',
                icon: <MdiIcon path={mdiPowerSocketUs} size="21px" className="mr-1" />
            },
        ]
    }
]