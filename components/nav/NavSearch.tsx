import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuildingCode, MdiIcon, ResolvableBuildingCode, getIconForBuilding } from '~/util';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '../ui/command';

import {
    mdiBed,
    mdiBookEducation,
    mdiBookOpenPageVariant,
    mdiCalendar, mdiHome,
    mdiHumanMaleBoard,
    mdiLaptop,
    mdiSilverwareForkKnife,
    mdiWeightLifter
} from '@mdi/js';

type DataEntry = {
    href: string;
    title: string;
    content: JSX.Element;
}

type DataType = {
    PAGES: DataEntry[];
    COURSES: DataEntry[];
    BUILDINGS: DataEntry[];
    ROOMS: DataEntry[];
}

const SearchData: DataType = {
    PAGES: [
        {
            title: 'Home',
            href: '/',
            content: (
                <>
                    <MdiIcon path={mdiHome} size="21px" className="mr-2" /> Home
                </>
            )
        },
        {
            title: 'Available Rooms',
            href: '/buildings/available',
            content: (
                <>
                    <MdiIcon path={mdiCalendar} size="21px" className="mr-2" /> Available Rooms
                </>
            )
        },
        {
            title: 'Buildings',
            href: '/buildings',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Buildings
                </>
            )
        },
        {
            title: 'Courses',
            href: '/courses',
            content: (
                <>
                    <MdiIcon path={mdiBookEducation} size="21px" className="mr-2" /> Courses
                </>
            )
        },
        {
            title: 'Dining',
            href: '/dining',
            content: (
                <>
                    <MdiIcon path={mdiSilverwareForkKnife} size="21px" className="mr-2" /> Dining
                </>
            )
        },
        {
            title: 'Recreation Center',
            href: '/rec',
            content: (
                <>
                    <MdiIcon path={mdiWeightLifter} size="21px" className="mr-2" /> Recreation Center
                </>
            )
        },
        {
            title: 'Residential Life',
            href: '/dorms',
            content: (
                <>
                    <MdiIcon path={mdiBed} size="21px" className="mr-2" /> Residential Life
                </>
            )
        },
        {
            title: 'Study Spaces',
            href: '/study',
            content: (
                <>
                    <MdiIcon path={mdiBookOpenPageVariant} size="21px" className="mr-2" /> Study Spaces
                </>
            )
        }
    ],
    COURSES: [
        {
            title: 'CSE1010',
            href: '/courses/cse1010',
            content: (
                <>
                    <MdiIcon path={mdiLaptop} size="21px" className="mr-2" /> CSE1010
                </>
            )
        },
        {
            title: 'CSE1729',
            href: '/courses/cse1729',
            content: (
                <>
                    <MdiIcon path={mdiLaptop} size="21px" className="mr-2" /> CSE1729
                </>
            )
        },
        {
            title: 'CSE2050',
            href: '/courses/cse2050',
            content: (
                <>
                    <MdiIcon path={mdiLaptop} size="21px" className="mr-2" /> CSE2050
                </>
            )
        },
        {
            title: 'CSE2500',
            href: '/courses/cse2500',
            content: (
                <>
                    <MdiIcon path={mdiLaptop} size="21px" className="mr-2" /> CSE2500
                </>
            )
        },
        {
            title: 'CSE3100',
            href: '/courses/cse3100',
            content: (
                <>
                    <MdiIcon path={mdiLaptop} size="21px" className="mr-2" /> CSE3100
                </>
            )
        },
    ],
    BUILDINGS: Object.keys(BuildingCode).map(code => ({
        title: BuildingCode[code as ResolvableBuildingCode],
        href: `/buildings/${code}`,
        content: (
            <>
                {getIconForBuilding(code as ResolvableBuildingCode, 'mr-2', 21)}{" "}
                {BuildingCode[code as ResolvableBuildingCode]}
            </>
        )
    })),
    ROOMS: [
        {
            title: 'Austin 101',
            href: '/rooms/aust101',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Austin 101
                </>
            )
        },
        {
            title: 'Austin 102',
            href: '/rooms/aust102',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Austin 102
                </>
            )
        },
        {
            title: 'Austin 103',
            href: '/rooms/aust103',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Austin 103
                </>
            )
        },
        {
            title: 'Austin 104',
            href: '/rooms/aust104',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Austin 104
                </>
            )
        },
        {
            title: 'Austin 105',
            href: '/rooms/aust105',
            content: (
                <>
                    <MdiIcon path={mdiHumanMaleBoard} size="21px" className="mr-2" /> Austin 105
                </>
            )
        }
    ]
}

const renderDataGroup = (
    segment: keyof DataType,
    dispatch: (route: string) => void
) => SearchData[segment].map((entry, i) => (
    <CommandItem
        key={entry.href}
        value={entry.title}
        onSelect={() => dispatch(entry.href)}
    >
        {entry.content}   
    </CommandItem>
))

export const NavSearch: React.FC = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const dispatch = (href: string) => {
        router.push(href);
        setOpen(false);
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(open => !open);
            }
        }

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative bg-gray-800 h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-72"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search for anything...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.4rem] hidden h-5 select-none items-center gap-1 rounded border bg-gray-900 px-1.5 font-mono text-[11px] font-medium opacity-100 sm:flex">
                    <span className="text-[16px]">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search for anything.." />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup heading="Pages">
                        {renderDataGroup('PAGES', dispatch)}
                    </CommandGroup>
                    {/* <CommandGroup heading="Courses">
                        {renderTestDataSegment('COURSES')}
                    </CommandGroup> */}
                    <CommandGroup heading="Buildings">
                        {renderDataGroup('BUILDINGS', dispatch)}
                    </CommandGroup>
                    {/* <CommandGroup heading="Rooms">
                        {renderTestDataSegment('ROOMS')}
                    </CommandGroup> */}
                </CommandList>
            </CommandDialog>
        </>
    )
}