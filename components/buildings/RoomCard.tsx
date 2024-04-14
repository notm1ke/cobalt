import moment from 'moment';

import { SignEntry } from '~/lib/sign';
import { Card, CardContent } from '../ui/card';
import { Classroom, SeatingType } from '@ilefa/husky';

import {
    mdiAccountMultiple,
    mdiCalendarCheck,
    mdiCalendarRemove,
    mdiClock
} from '@mdi/js';

import {
    BuildingCode,
    MdiIcon,
    ResolvableBuildingCode,
    css,
    getCurrentAndNextEvents,
    getIconForRoom,
    getLatestTimeValue
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
        <span className="text-gray-500 text-sm font-mono">
            <MdiIcon path={mdiCalendarCheck} className="inline align-middle text-green-500" size="16px" /> No upcoming events.
        </span>
    );

    if (!current && next?.length) return (
        <span className="text-orange-400 text-sm font-mono">
            <MdiIcon path={mdiClock} className="inline align-middle" size="16px" />{" "}
            <span className="font-semibold">{next[0].title}</span> starts in{" "}
            <span className="font-semibold">{getLatestTimeValue(next[0].startTime.getTime() - Date.now(), 2)}</span>.
        </span>
    );

    if (current) return (
        <span className="text-red-400 text-sm font-mono">
            <MdiIcon path={mdiCalendarRemove} className="inline align-middle" size="16px" />{" "}
            <span className="font-semibold">{current!.title}</span> for next {moment(current!.endTime).fromNow()}
        </span>
    );
    
    return <></>;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, sign }) => (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden min-w-[308px] max-w-[308px]">
        <div className={css('p-6 flex items-center justify-center', roomTypeColor(room.seatingType))}>
            {getIconForRoom(room, '', 28)}
        </div>
        <CardContent>
            <h3 className="text-lg font-mono font-bold tracking-tighter text-gray-700 mt-5 cursor-pointer hover:text-gray-700/60">
                {BuildingCode[room.building.code as ResolvableBuildingCode]}{" "}
                {room.name.split(room.building.code)[1]}
            </h3>

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