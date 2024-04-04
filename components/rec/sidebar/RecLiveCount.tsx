'use client';

import moment from 'moment';

import { useEffect, useState } from 'react';
import { OccupantRecord, getRealtimeCount } from '~/lib/rec';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { MdiIcon, getTimeUntilRecClose, getTypicalForTime, picker } from '~/util';

import {
    mdiAccount,
    mdiAccountGroup,
    mdiAccountMultiple,
    mdiLoading,
    mdiMoonWaningCrescent
} from '@mdi/js';

export interface RecLiveCountProps {
    avgs: OccupantRecord[];
}

const renderVarianceIndicator = (now: number, typical: number) => {
    let percent = ((now - typical) / typical) * 100;
    let components = picker<number, { color: string, text: string, icon: string }>([
        {
            pick: 0,
            value: () => ({
                color: 'text-orange-400',
                text: 'Typical',
                icon: mdiAccountMultiple
            })
        },
        {
            pick: -10,
            value: () => ({
                color: 'text-green-600',
                text: 'Less busy than usual',
                icon: mdiAccount
            })
        },
        {
            pick: 10,
            value: () => ({
                color: 'text-red-600',
                text: 'Busier than usual',
                icon: mdiAccountGroup
            })
        }
    ]);

    let { color, text, icon } = components(percent)!;

    return (
        <p className="text-xs text-gray-500 mt-2">
            <span className={color}>
                <MdiIcon path={icon} size="15px" className="inline align-text-top" /> {text}
            </span>{" "} for <span className="font-semibold">{moment().format('ddd h:mm A')}</span>
        </p>
    );
}

export const RecLiveCount: React.FC<RecLiveCountProps> = ({ avgs }) => {
    const [count, setCount] = useState<number>();
    const [typical, setTypical] = useState<number>();

    const callRealtimeService = () => {
        getRealtimeCount().then(count => setCount(count));
    };

    useEffect(() => {
        getRealtimeCount().then(count => setCount(count));

        const interval = setInterval(() => callRealtimeService(), 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!avgs || !avgs.length) return;
        
        let typical = getTypicalForTime(avgs);
        if (!typical) return;
        
        setTypical(typical.count);
    }, [avgs]);

    if (count === undefined) return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-blue-400 font-mono">
                    People at the Rec
                </CardTitle>
                <MdiIcon path={mdiAccountMultiple} size="24px" className="text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold font-mono text-gray-700 tracking-tighter">
                    <MdiIcon path={mdiLoading} spin className="inline" size="24px" /> Loading...
                </div>
            </CardContent>
        </Card>
    );

    let recClosed = getTimeUntilRecClose('SRC') <= 0;

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-blue-400 font-mono">
                    People at the Rec
                </CardTitle>
                <MdiIcon path={mdiAccountMultiple} size="24px" className="text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold font-mono text-gray-700 tracking-tighter">
                    {count}
                </div>
                
                {typical && !recClosed && renderVarianceIndicator(count, typical)}
                
                {
                    recClosed && (
                        <p className="text-xs text-gray-500 mt-2">
                            <span className="text-orange-300">
                                <MdiIcon path={mdiMoonWaningCrescent} size="15px" rotate={-40} className="inline align-text-top" />{" "}
                                Currently closed
                            </span>{" "} &bull; Check back later
                        </p>
                    )
                }
            </CardContent>
        </Card>
    );
}