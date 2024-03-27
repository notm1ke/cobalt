"use client";

import Link from 'next/link';

import { MdiIcon, SITE_LOGO, css } from '~/util';

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

import {
    ListItem,
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from './ui/navigation-menu';

type Route = {
    name: string;
    key: string;
    path: string;
    dropdown?: DropdownContent[];
}

type DropdownContent = {
    name: string;
    key: string;
    description: string;
    icon?: JSX.Element;
    path: string;
    newTab?: boolean;
}

const Routes: Route[] = [
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

export const Navigation: React.FC = () => {
    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="text-lg mr-6 flex items-center space-x-2">
                <MdiIcon path={SITE_LOGO} size={1} className="h-7 w-7" />
                <span className="hidden font-extrabold font-mono sm:inline-block">
                    Cobalt
                </span>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    {
                        Routes.map(route => {
                            if (route.dropdown) return (
                                <NavigationMenuItem key={route.key}>
                                    <NavigationMenuTrigger className="font-mono font-bold">
                                        {route.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {
                                                route.dropdown.map(({ name, key, description, path, icon, newTab }) => (
                                                    <ListItem
                                                        key={key}
                                                        title={name}
                                                        icon={icon}
                                                        href={path}
                                                        {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
                                                    >
                                                        {description}
                                                    </ListItem>
                                                ))
                                            }
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );

                            return (
                                <NavigationMenuItem key={route.key}>
                                    <Link href={route.path} legacyBehavior passHref>
                                        <NavigationMenuLink className={css('font-mono', navigationMenuTriggerStyle())}>
                                            {route.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )
                        })
                    }
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}