import { MdiIcon } from '~/util';
import { useEffect, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import { mdiClock, mdiSquareRounded } from '@mdi/js';
import { OccupantRecord, getTodayStats } from '~/lib/rec';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import moment from 'moment';

export interface RecLiveVsAvgChartProps {
    avgs: OccupantRecord[];
}

type ChartEntry = {
    time: string;
    avg: number;
    live?: number;
}

type ChartTooltip = {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip: React.FC<ChartTooltip> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        let [live, avg] = payload;

        // if live line is not there, swap the values as avg becomes index 0
        if (!avg) {
            avg = live;
            live = null;
        }

        return (
            <div className="custom-tooltip bg-primary opacity-95 p-3 text-gray-700 rounded-lg">
                <p className="label font-mono font-bold tracking-tightest opacity-100">
                    <MdiIcon path={mdiClock} size="20px" className="inline align-text-top" /> {label}
                </p>
                {/* create a divider */}
                <div className="my-2" />
                    <div className="grid gap-[0.35rem]">
                        <div className="flex text-[13px]">
                            <div className="font-mono font-semibold whitespace-nowrap text-gray-700">
                                <span>
                                    <MdiIcon path={mdiSquareRounded} size="19px" className="inline align-text-top text-green-500 rounded-lg" />{" "}
                                    Live
                                </span>
                            </div>
                            <div className="flex flex-1 relative justify-center items-center mx-[7px] top-[-9px]"></div>
                            <div className="tabular-nums text-gray-500">
                                <span>{live?.value ?? 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex text-[13px]">
                            <div className="font-mono font-semibold whitespace-nowrap text-gray-700">
                                <span>
                                    <MdiIcon path={mdiSquareRounded} size="19px" className="inline align-text-top text-blue-500 rounded-lg" />{" "}
                                    Average
                                </span>                           
                            </div>
                            <div className="flex flex-1 relative justify-center items-center mx-[7px] top-[-9px]"></div>
                            <div className="tabular-nums text-gray-500">
                                <span>{avg.value}</span>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }

    return null;
};

const timeSorter = (a: ChartEntry, b: ChartEntry) => {
    let aTime = moment(a.time, 'h:mm A').valueOf();
    let bTime = moment(b.time, 'h:mm A').valueOf();
    return aTime - bTime;
}

export const RecLiveVsAvgChart: React.FC<RecLiveVsAvgChartProps> = ({ avgs }) => {
    const [today, setToday] = useState<OccupantRecord[]>();

    useEffect(() => {
        getTodayStats().then(setToday);
    }, []);

    if (!today) return (
        <Skeleton className="w-full h-[620px]" />
    );

    let combined = avgs.reduce((acc, cur) => {
        let live = today.find(live => live.time === cur.time);
        return [...acc, { time: cur.time, avg: cur.count, live: live?.count ?? undefined }];
    }, [] as ChartEntry[]);

    // if mobile - render historic + last 15 entries
    if (window && window.innerWidth < 768)
        combined = combined
            .filter(ent => ent.live !== undefined)
            .slice(-15);

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-blue-400 font-mono font-bold">
                    Live vs Average
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={410}>
                    <LineChart
                        width={450}
                        height={300}
                        data={combined}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                            tick={{
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                fill: '#6B7280',
                                dy: 7
                            }}
                        />

                        <YAxis
                            tick={{
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                fill: '#6B7280',
                                dx: -5
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            connectNulls
                            type="monotone"
                            dataKey="live"
                            stroke="#65B868"
                            fill="#65B868"
                            activeDot={{ r: 4 }}
                        />

                        <Line
                            connectNulls
                            type="monotone"
                            dataKey="avg"
                            stroke="#35A2EB"
                            fill="#35A2EB"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}