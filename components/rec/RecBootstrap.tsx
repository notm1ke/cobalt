'use client';

import { useEffect, useState } from 'react';
import { RecHours } from './sidebar/RecHours';
import { RecInsights } from './sidebar/RecInsights';
import { RecLiveCount } from './sidebar/RecLiveCount';
import { RecClosingTime } from './sidebar/RecClosingTime';
import { OccupantRecord, getTodayAverage } from '~/lib/rec';
import { RecLiveVsAvgChart } from './charts/RecLiveVsAvgChart';

export const RecBootstrap: React.FC = () => {
    const [avgs, setAvgs] = useState<OccupantRecord[]>();

    useEffect(() => {
        getTodayAverage().then(setAvgs);
    }, []);

    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                    Recreation Center
                </h1>
                <p className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                    <RecClosingTime />
                </p>
            </section>
            <section className="mx-auto flex flex-col items-center mt-3 py-8">
                <div className="flex flex-col gap-10 w-full md:flex-row">
                    <div className="md:w-1/4 sm:w-full space-y-3">
                        <div className="mb-2">
                            <RecLiveCount avgs={avgs ?? []} />
                        </div>
                        <div className="mb-2">
                            <RecInsights avgs={avgs ?? []} />
                        </div>
                        <div className="mb-2">
                            <RecHours />
                        </div>
                    </div>
                    <div className="md:w-3/4 sm:w-full space-y-3">
                        <RecLiveVsAvgChart avgs={avgs ?? []} />
                    </div>
                </div>
            </section>
        </div>
    )
}