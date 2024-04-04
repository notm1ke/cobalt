import { useMemo } from 'react';
import { mdiStoreClock } from '@mdi/js';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import {
    MdiIcon,
    RecFacility,
    StandardRecHours,
    css,
    getHoursForToday,
    getTimeUntilRecClose
} from '~/util';

const facilityStatusIndicator = (facility: keyof typeof StandardRecHours) => {
    let open = getTimeUntilRecClose(facility) > 0;
    if (!open) return (
        <span className="text-red-500">
            Closed
        </span>
    );

    return (
        <span className="text-green-500">
            Open
        </span>
    );
}

export const RecHours: React.FC = () => {
    let hours = useMemo(() => getHoursForToday(), []);
    
    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-blue-400 font-mono">
                    Hours of Operation
                </CardTitle>
                <MdiIcon path={mdiStoreClock} size="24px" className="text-blue-400" />
            </CardHeader>
            <CardContent>
                {
                    hours.map((entry, i, arr) => (
                        <div key={entry.facility} className={css(i !== arr.length - 1 && 'mb-2', i > 0 && 'mt-3')}>
                            <span className="text-sm font-mono font-bold mb-1 text-blue-300">{RecFacility[entry.facility]}</span>
                            <div className="grid gap-[0.35rem]">
                                <div className="flex text-[13px]">
                                    <div className="tabular-nums text-gray-500">
                                        {facilityStatusIndicator(entry.facility)} &bull;{" "}
                                        <span>{entry.open} - {entry.close}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    )
}