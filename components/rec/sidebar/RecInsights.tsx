
import { useMemo } from 'react';
import { MdiIcon } from '~/util';
import { mdiAntenna } from '@mdi/js';
import { OccupantRecord } from '~/lib/rec';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export interface RecInsightsProps {
    avgs: OccupantRecord[];
}

const getEstimatedPeaks = (avgs: OccupantRecord[]) => {
    if (!avgs || !avgs.length) return [];
    
    // compute the local maximums of the data and return an array of times which are estimated to be peaks
    let peaks = avgs.reduce((acc, cur, idx, arr) => {
        if (idx === 0 || idx === arr.length - 1) return acc;

        let prev = arr[idx - 1];
        let next = arr[idx + 1];

        if (cur.count > prev.count && cur.count > next.count) {
            acc.push(cur.time);
        }

        return acc;
    }, [] as string[]);
    
    return peaks;
}

export const RecInsights: React.FC<RecInsightsProps> = ({ avgs }) => {
    const estimatedPeaks = useMemo(() => getEstimatedPeaks(avgs), [avgs]);

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-blue-400 font-mono">
                    Insights
                </CardTitle>
                <MdiIcon path={mdiAntenna} size="24px" className="text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-sm font-mono text-gray-700">
                    <p className="mb-2">
                        <span className="font-semibold">Estimated Peak Times</span>
                    </p>
                    
                    {
                        estimatedPeaks && (
                            <ul className="list-none">
                                {
                                    estimatedPeaks.map((time, idx) => (
                                        <li key={idx}>{time}</li>
                                    ))
                                }
                            </ul>
                        )
                    }

                    {
                        (!estimatedPeaks || !estimatedPeaks.length) && (
                            <p className="text-gray-400">No estimated peaks</p>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}