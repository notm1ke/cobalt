'use server';

import { DaysOfWeek } from '~/util/rec';

const url = (path: string) => process.env.FITPULSE_HOST + path;

export type DailyStatsRecord = {
    date: string;
    records: OccupantRecord[];
}

export type WeeklyStatsRecord = {
    day: keyof typeof DaysOfWeek;
    average: number;
    values: OccupantRecord[];
}

export type OccupantRecord = {
    time: string;
    count: number;
}

export const getRealtimeCount = async (): Promise<number> =>
    await fetch(url('/now'), {
        method: 'POST',
        next: { revalidate: 30 }
    })
    .then(res => res.json())
    .then(res => res.count)
    .catch(() => 0);

export const getTodayStats = (): Promise<OccupantRecord[]> =>
    fetch(url('/today'), {
        method: 'POST',
        next: { revalidate: 60 }
    })
    .then(res => res.json())
    .then(res => res.data as OccupantRecord[])
    .catch(() => []);

export const getTodayAverage = async (): Promise<OccupantRecord[]> =>
    await fetch(url('/today/avg'), {
        method: 'POST',
        next: { revalidate: 60 }
    })
    .then(res => res.json())
    .then(res => res.data as OccupantRecord[])
    .catch(() => []);

export const getDailyStats = async (
    dayOfWeek: keyof typeof DaysOfWeek,
    startDate?: moment.Moment
): Promise<DailyStatsRecord[]> => {
    let day = DaysOfWeek[dayOfWeek];
    let start = startDate?.format('YYYY-MM-DD') ?? undefined;
    let payload = { day, start };

    return await fetch(url('/history/daily'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        next: { revalidate: 60 }
    })
    .then(res => res.json())
    .then(res => res.data as DailyStatsRecord[])
    .catch(() => []);
}

export const getWeeklyStats = async () => 
    await fetch(url('/history/weekly'), {
        method: 'POST',
        next: { revalidate: 60 }
    })
    .then(res => res.json())
    .then(res => res.data as WeeklyStatsRecord[])
    .catch(() => []);