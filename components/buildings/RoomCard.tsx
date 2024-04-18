import { SignEntry } from '~/lib/sign';
import { Card, CardContent } from '../ui/card';
import { BoardType, Classroom, LectureCaptureType, SeatingType, TechType } from '@ilefa/husky';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '../ui/dialog';

import {
    mdiAccountMultiple,
    mdiAntenna,
    mdiArrowRight,
    mdiCalendarCheck,
    mdiCalendarRemove,
    mdiCheck,
    mdiClock,
    mdiHelp,
    mdiMinus
} from '@mdi/js';

import {
    BuildingCode,
    MdiIcon,
    ResolvableBuildingCode,
    css,
    getCurrentAndNextEvents,
    getIconForRoom,
    getLatestTimeValue,
    picker
} from '~/util';

export interface RoomCardProps {
    room: Classroom;
    sign?: SignEntry;
}

const roomTypeColor = (type: keyof typeof SeatingType) => {
    switch (type) {
        case 'ACTIVE':
            return 'bg-green-500';
        case 'FIXED_AUDITORIUM':
        case 'FIXED_LEVELED_TABLES':
            return 'bg-orange-500';
        case 'FIXED_TABLES':
        case 'TABLES':
        case 'TABLES_AND_ARMCHAIRS':
        case 'TABLET_ARMCHAIRS':
            return 'bg-blue-500';
        case 'LAB_TABLES':
            return 'bg-yellow-500';
        default:
            return 'bg-gray-500';
    }
}

const signIndicator = (sign: SignEntry): JSX.Element => {
    let [current, next] = getCurrentAndNextEvents(sign);
    if (!current && !next?.length) return (
        <span className="text-gray-500 text-sm font-mono tracking-tighter">
            <MdiIcon path={mdiCalendarCheck} className="inline align-middle text-green-500" size="16px" /> No upcoming events.
        </span>
    );

    if (!current && next?.length) return (
        <span className="text-orange-400 text-sm font-mono tracking-tighter">
            <MdiIcon path={mdiClock} className="inline align-middle" size="16px" />{" "}
            <span className="font-semibold">{next[0].title}</span> starts in{" "}
            <span className="font-semibold">{getLatestTimeValue(next[0].startTime.getTime() - Date.now(), 2)}</span>.
        </span>
    );

    if (current) return (
        <span className="text-blue-400 text-sm font-mono tracking-tighter">
            <MdiIcon path={mdiAntenna} className="inline align-text-top" size="16px" />{" "}
            <span className="font-semibold">{current!.title}</span> for next {getLatestTimeValue(current!.endTime.getTime() - Date.now(), 2)}.
        </span>
    );
    
    return <></>;
}

const amenityIndicator = picker<boolean | undefined, JSX.Element>([
    {
        pick: true,
        value: _ => <MdiIcon path={mdiCheck} className="inline align-middle text-green-500" size="16px" />
    },
    {
        pick: false,
        value: _ => <MdiIcon path={mdiMinus} className="inline align-middle text-red-500" size="16px" />
    },
    {
        pick: undefined,
        value: _ => <MdiIcon path={mdiHelp} className="inline align-middle text-blue-400" size="16px" />
    }
]);

export const RoomCard: React.FC<RoomCardProps> = ({ room, sign }) => (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden min-w-[308px] md:max-w-[308px]">
        <div className={css('p-6 flex items-center justify-center', roomTypeColor(room.seatingType))}>
            {getIconForRoom(room, '', 28)}
        </div>
        <CardContent>
            <Dialog>
                <DialogTrigger asChild>
                    <h3 className="text-lg font-mono font-bold tracking-tighter text-gray-700 mt-5 cursor-pointer hover:text-gray-700/60">
                        {BuildingCode[room.building.code as ResolvableBuildingCode]}{" "}
                        {room.name.split(room.building.code)[1]}
                    </h3>
                </DialogTrigger>
                <DialogContent className="max-w-[400px] md:max-w-[500px] bg-white text-gray-700 rounded-lg">
                    <DialogHeader>
                        <h3 className="text-lg font-mono font-bold tracking-tighter text-gray-700 text-start">
                            {getIconForRoom(room, 'inline align-text-top', 24)}{" "}
                            {BuildingCode[room.building.code as ResolvableBuildingCode]}{" "}
                            {room.name.split(room.building.code)[1]}
                        </h3>
                    </DialogHeader>
                    <DialogDescription>
                        <p className="text-sm font-mono font-semibold tracking-tighter text-gray-500">
                            <span className="text-blue-500">
                                <MdiIcon path={mdiAccountMultiple} className="inline-block" size="16px" /> {room.capacity.full}
                            </span> &bull;
                            {" "}{SeatingType[room.seatingType]}
                        </p>
                        {
                            !sign && (
                                <span className="text-red-400 text-sm font-mono">
                                    <MdiIcon path={mdiCalendarRemove} className="inline align-middle" size="16px" /> Realtime info unavailable.
                                </span>
                            )
                        }
                        {
                            sign && signIndicator(sign)
                        }
                    </DialogDescription>

                    <div className="grid grid-cols-1 gap-5 md:gap-10 md:grid-cols-2">
                        <div className="md:mt-5">
                            <h4 className="text-lg font-mono font-bold tracking-tighter text-gray-700">
                                Room Information
                            </h4>
                            <ul className="list-none mt-3">
                                <li>
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        Technology:{" "}
                                        <span className="text-gray-500">{TechType[room.techType as keyof typeof TechType]}</span>
                                    </p>
                                </li>
                                <li>
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        Board:{" "}
                                        <span className="text-gray-500">{BoardType[room.boardType]}</span>
                                    </p>
                                </li>
                                <li>
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        Conferencing:{" "}
                                        <span className="text-gray-500">{room.videoConference?.name ?? 'None'}</span>
                                    </p>
                                </li>
                                <li>
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        Lecture Capture:{" "}
                                        <span className="text-gray-500">{LectureCaptureType[room.lectureCapture]}</span>
                                    </p>
                                </li>
                                <li className="mt-3">
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        {amenityIndicator(room.airConditioned)}{" "}
                                        Air Conditioning
                                    </p>
                                </li>
                                <li>
                                    <p className="text-sm font-mono tracking-tighter text-gray-700">
                                        {amenityIndicator(room.byodTesting)}{" "}
                                        BYOD Testing
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div className="md:mt-5">
                            <h4 className="text-lg font-mono font-bold tracking-tighter text-gray-700">
                                Resources
                            </h4>
                            <ul className="list-none mt-3">
                                {
                                    room.liveStreamUrl && (
                                        <li>
                                            <a
                                                href={room.liveStreamUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-mono tracking-tighter text-blue-500 hover:text-blue-500/80"
                                            >
                                                Live Stream{" "}
                                                <MdiIcon path={mdiArrowRight} className="inline align-middle" size="16px" />
                                            </a>
                                        </li>
                                    )
                                }
                                {
                                    room.threeSixtyView && (
                                        <li>
                                            <a
                                                href={room.threeSixtyView}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-mono tracking-tighter text-blue-500 hover:text-blue-500/80"
                                            >
                                                360&#176; View{" "}
                                                <MdiIcon path={mdiArrowRight} className="inline align-middle" size="16px" />
                                            </a>
                                        </li>
                                    )
                                }
                                <li>
                                    <a
                                        href={`https://classrooms.uconn.edu/classroom/${room.building.code.toLowerCase()}-${room.name.split(room.building.code)[1]}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-mono tracking-tighter text-blue-500 hover:text-blue-500/80"
                                    >
                                        Classrooms Page{" "}
                                        <MdiIcon path={mdiArrowRight} className="inline align-middle" size="16px" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-2 md:mt-5">
                        <h4 className="text-lg font-mono font-bold tracking-tighter text-gray-700">
                            Today&apos;s Events
                        </h4>
                        {
                            sign?.items.map((item, idx) => (
                                <div key={idx} className="mt-3">
                                    <h5 className="text-sm font-mono font-semibold tracking-tighter text-gray-700">
                                        {item.title}
                                    </h5>
                                    <p className="text-sm font-mono tracking-tighter text-gray-500">
                                        {item.content}
                                    </p>
                                </div>
                            ))
                        }
                        {
                            !sign?.items?.length && (
                                <p className="text-sm font-mono tracking-tighter text-gray-500">
                                    No events today.
                                </p>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>

            <p className="text-sm font-mono font-semibold tracking-tighter text-gray-500">
                <span className="text-blue-500">
                    <MdiIcon path={mdiAccountMultiple} className="inline-block" size="16px" /> {room.capacity.full}
                </span> &bull;
                {" "}{SeatingType[room.seatingType]}
            </p>

            {
                !sign && (
                    <span className="text-red-400 text-sm font-mono">
                        <MdiIcon path={mdiCalendarRemove} className="inline align-middle" size="16px" /> Realtime info unavailable.
                    </span>
                )
            }

            {
                sign && signIndicator(sign)
            }
        </CardContent>
    </Card>
)