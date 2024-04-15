'use client';

import { Button } from '../ui/button';
import { RoomCard } from './RoomCard';
import { SignEntry } from '~/lib/sign';
import { Classroom } from '@ilefa/husky';
import { useEffect, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import { Building, tryUnsafeResolve } from '~/lib/buildings';

import {
    MdiIcon,
    ResolvableBuildingCode,
    capitalizeFirst,
    css,
    getCurrentAndNextEvents,
    getIconForBuilding
} from '~/util';

import {
    mdiCalendarText,
    mdiClock,
    mdiHumanMaleBoard,
    mdiInformation,
    mdiLifebuoy,
    mdiLink,
    mdiMap,
    mdiMapMarker,
    mdiMonitorSpeaker,
    mdiSofaSingle
} from '@mdi/js';

export interface InspectorBootstrapProps {
    query: string;
}

type InspectorTab = {
    key: 'classrooms' | 'available' | 'events';
    displayName: string;
    icon: string;
}

const Tabs = (building: Building): InspectorTab[] => ([
    {
        key: 'classrooms',
        displayName: `Rooms (${building.classrooms.length})`,
        icon: mdiHumanMaleBoard
    },
    {
        key: 'available',
        displayName: 'Available Rooms',
        icon: mdiSofaSingle
    },
    // {
    //     key: 'events',
    //     displayName: 'Room Schedules',
    //     icon: mdiCalendarText
    // }
]);

type RoomWithSign = {
    room: Classroom;
    sign: SignEntry;
}

const getAvailableRooms = (building: Building): RoomWithSign[] => {
    let rooms = building.classrooms.map(room => ({
        room,
        sign: building.signs.find(s => s.title.replace('_', '').toLowerCase() === room.name.toLowerCase())
    }));

    return rooms.filter(r => {
        if (!r.sign) return false;
        let [current, _next] = getCurrentAndNextEvents(r.sign!);
        return !current;
    }) as RoomWithSign[];
}

const RoomScheduleTimeline: React.FC<{ building: Building }> = ({ building }) => {
    return <></>;       
}

export const InspectorBootstrap: React.FC<InspectorBootstrapProps> = ({ query }) => {
    const [tab, setTab] = useState<string>('classrooms');
    const [building, setBuilding] = useState<Building | null>();

    useEffect(() => {
        tryUnsafeResolve(query).then(setBuilding);
    }, []);

    let enabled = building && building.name;

    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                {
                    !enabled && (
                        <Skeleton className="w-24 h-24" />
                    )
                }

                {
                    enabled && (
                        <>
                            <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                                {getIconForBuilding(building!.code as ResolvableBuildingCode, 'inline align-top', 40)}{" "}
                                {building!.code}
                            </h1>

                            <p suppressHydrationWarning className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                                {building!.name}
                            </p>
                        </>
                    )
                }
            </section>
            <section className="mx-auto flex flex-col items-center mt-3 py-8">
                <div className="flex flex-col gap-10 w-full md:flex-row">
                    {
                        !enabled && (
                            <Skeleton className="w-full h-[300px]" />
                        )
                    }

                    {
                        enabled && (
                            <div>
                                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 mb-9">
                                    <div>
                                        <span className="text-xl font-mono font-bold">
                                            <MdiIcon path={mdiInformation} size="26px" className="inline align-text-top" />{" "}
                                            Building Information
                                        </span>

                                        <p className="mt-3">
                                            {building!.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:ml-1">
                                        <div>
                                            <span className="text-xl font-mono font-bold">
                                                <MdiIcon path={mdiMap} size="26px" className="inline align-text-top" />{" "}
                                                Location
                                            </span>

                                            <p className="mt-3">
                                                Located {/^[0-9].*/.test(building!.address) ? 'at' : 'on'} {building!.address}
                                                <br />Building is on the{" "}
                                                <span className="font-semibold">
                                                    {capitalizeFirst(building!.campus.replace('_', ' '))}
                                                </span>{" "}
                                                campus.
                                            </p>

                                            <Button asChild className="text-[14px] font-mono text-white mt-3" variant="secondary">
                                                <a href={building!.maps} target="_blank" rel="noopener noreferrer">
                                                    <MdiIcon path={mdiMapMarker} size="18px" className="mr-2 align-text-top" />{" "}
                                                    View in Maps
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="md:text-right">
                                            <span className="text-xl font-mono font-bold">
                                                <MdiIcon path={mdiLink} size="26px" className="inline align-text-top" />{" "}
                                                Quick Links
                                            </span>

                                            <p className="mt-3">
                                                <Button asChild className="text-[14px] font-mono text-white" variant="secondary">
                                                    <a href="https://kb.uconn.edu/space/TL/10795451412/Classroom+Technology" target="_blank" rel="noopener noreferrer">
                                                        Classroom Tech 101 <MdiIcon path={mdiMonitorSpeaker} size="18px" className="ml-2 align-text-top" />
                                                    </a>
                                                </Button>
                                                <Button asChild className="text-[14px] font-mono text-white mt-2" variant="secondary">
                                                    <a href="https://scheduling.uconn.edu/standard-meeting-times/" target="_blank" rel="noopener noreferrer">
                                                        Standard Use Times <MdiIcon path={mdiClock} size="18px" className="ml-2 align-text-top" />
                                                    </a>
                                                </Button>
                                                <Button asChild className="text-[14px] font-mono text-white mt-2" variant="destructive">
                                                    <a href="https://kb.uconn.edu/space/IKB/10769924612/Audio+Visual+Technology+Support+Guide" target="_blank" rel="noopener noreferrer">
                                                        Report Room Issues <MdiIcon path={mdiLifebuoy} size="18px" className="ml-2 align-text-top" />
                                                    </a>
                                                </Button>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-9">
                                    {
                                        Tabs(building!).map((t, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => setTab(t.key)}
                                                className={css(
                                                    `text-[14px] h-12 mr-3 font-mono`,
                                                    tab === t.key ? 'text-gray-700' : 'text-white',
                                                    tab === t.key ? 'hover:text-gray-600' : 'hover:text-gray-300',
                                                    tab === t.key ? 'bg-white' : 'bg-secondary',
                                                    tab === t.key ? 'hover:bg-gray-300' : 'hover:bg-secondary/80'
                                                )}
                                            >
                                                <MdiIcon path={t.icon} size="18px" className="mr-2 align-text-top" />{" "}
                                                {t.displayName}
                                            </Button>
                                        ))
                                    }
                                </div>
                                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                                    {
                                        tab === 'classrooms' && building!.classrooms.map((room, index) => (
                                            <RoomCard
                                                key={index}
                                                room={room}
                                                sign={
                                                    building!
                                                        .signs
                                                        .find(s => s
                                                            .title
                                                            .replace('_', '')
                                                            .toLowerCase() === room.name.toLowerCase()
                                                        )}
                                            />
                                        ))
                                    }

                                    {
                                        tab === 'available' && getAvailableRooms(building!).map((room, i) => (
                                            <RoomCard key={i} room={room.room} sign={room.sign} />
                                        ))
                                    }

                                    {
                                        tab === 'events' && <RoomScheduleTimeline building={building!} />
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}