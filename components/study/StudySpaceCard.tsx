/* eslint-disable @next/next/no-img-element */

import moment from 'moment';

import { Badge } from '../ui/badge';
import { StudySpace } from '~/lib/study';
import { MdiIcon, capitalizeFirst, css, picker } from '~/util';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

import {
    mdiAccountMultiple,
    mdiCalendarMonth,
    mdiClock,
    mdiEmoticon,
    mdiSquareRounded
} from '@mdi/js';

export interface StudySpaceCardProps {
    space: StudySpace;
}

const cleanName = (name: string) => {
    if (name.startsWith('Individual'))
        return name.split('Individual Study Room ')[1];
    return name;
}

const availabilityStatusIndicator = (space: StudySpace) => {
    let now = moment();
    let records = space.availability.map(ent => ({
        ...ent,
        startDate: moment(ent.start),
        endDate: moment(ent.end)
    }));

    let currentRecord = records.some(ent => now.isBetween(ent.startDate, ent.endDate) && ent.state === 'available');
    if (currentRecord) {
        return (
            <span className="text-[13px] text-green-600">
                <MdiIcon path={mdiEmoticon} size="19px" className="inline align-text-top text-green-500" />{" "}
                Available now
            </span>
        )
    }

    let nextRecord = records.find(ent => now.isBefore(ent.startDate) && ent.state === 'available');
    if (nextRecord) {
        return (
            <span className="text-[13px] text-yellow-600">
                <MdiIcon path={mdiClock} size="19px" className="inline align-text-top text-yellow-400" />{" "}
                Next available at {nextRecord.startDate.format('h:mm A')}
            </span>
        )
    }

    return (
        <span className="text-[13px] text-red-400">
            <MdiIcon path={mdiCalendarMonth} size="19px" className="inline align-text-top text-red-400" />{" "}
            No available slots today.
        </span>
    
    )
}

const availabilityTooltipIndicator = picker<string, JSX.Element>([
    {
        pick: 'available',
        value: () => (
            <span className="text-[13px] text-green-600">
                <MdiIcon path={mdiSquareRounded} size="19px" className="inline align-middle text-green-400" />{" "}
                Available
            </span>
        )
    },
    {
        pick: 'unavailable',
        value: () => (
            <span className="text-[13px] text-red-400">
                <MdiIcon path={mdiSquareRounded} size="19px" className="inline align-middle text-red-400" />{" "}
                Unavailable
            </span>
        )
    }
]);

const availabilityGradient = picker<string, string>([
    {
        pick: 'available',
        value: () => 'bg-gradient-to-br from-green-500 to-transparent bg-green-500/60'
    },
    {
        pick: 'unavailable',
        value: () => 'bg-gradient-to-br from-gray-300 to-transparent bg-gray-300/60'
    }
]);

export const StudySpaceCard: React.FC<StudySpaceCardProps> = ({ space }) => (
    <div className="grid md:grid-cols-2 gap-0 w-full max-w-4xl mx-auto">
        <div>
            <img
                alt={space.name}
                className={css(
                    'w-full h-full object-cover rounded-t-lg md:rounded-tr-none md:rounded-tl-lg md:rounded-l-lg',
                    // availabilityGradient(space.availability[0].state)
                )}
                width="600"
                height="100%"
                src={space.image ?? '#'}
                style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                }}
            />
        </div>
        <div className="bg-white rounded-b-lg md:rounded-b-none md:rounded-br-lg md:rounded-r-lg">
            <div className="p-4 pb-0">
                <a
                    href={`https://uconncalendar.lib.uconn.edu/space/${space.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-blue-500 hover:text-blue-500/60 font-mono font-bold tracking-tighter"
                >
                    HBL {cleanName(space.name)}
                </a>

                <Badge variant="blue" className="ml-3 align-top float-right hover:bg-blue-400">
                    <div className="mr-1">
                        {capitalizeFirst(space.roomType)} <span className="font-extrabold"> &#65295; </span>
                    </div>
                    <MdiIcon path={mdiAccountMultiple} size="18px" className="inline align-text-top mr-1" />{" "}
                    {space.capacity}
                </Badge>

                <p className="text-gray-700 mt-2">
                    {space.description}
                    {/* {space.description.split('Note:')[0]} */}
                </p>
                <h4 className="text-lg text-gray-700 font-mono font-bold tracking-tighter mt-4">
                    Availability
                </h4>
                <p className="text-gray-700 mb-2">
                    {availabilityStatusIndicator(space)}
                </p>
            </div>
            <div className="grid grid-cols-12 gap-1 p-4 pt-2 pb-3">
                {
                    space.availability.slice(0, 12).map((availability, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                    <div
                                        key={index}
                                        className={css(
                                            'col-span-1 h-8 bg-gray-300 rounded-t-md rounded-b-md',
                                            availability.state === 'available' && 'bg-green-500',
                                            availability.state === 'unavailable' && 'bg-gray-300',
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {/* <div className="p-1">
                                        <h5 className="text-[13px] font-bold">
                                            {moment(availability.start).format('h:mm a')} - {moment(availability.end).format('h:mm a')}
                                        </h5>
                                        <p className="text-gray-700 mt-2">
                                            {availabilityTooltipIndicator(availability.state)}
                                        </p>
                                    </div> */}
                                    <span>
                                        <span className="font-bold">{moment(availability.start).format('h:mm A')} - {moment(availability.end).format('h:mm A')}</span>
                                        <p className="text-gray-700 mt-2">
                                            {availabilityTooltipIndicator(availability.state)}
                                        </p>
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))
                }
            </div>
        </div>
    </div>
)