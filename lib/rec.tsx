'use server';

import { call } from '.';
import { DaysOfWeek } from '~/util/rec';

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

type RealtimeCountResponse = {
    count: number;
}

type HistoricalStatsResponse<T = OccupantRecord> = {
    data: T[];
}

export const getRealtimeCount = async (): Promise<number> =>
    await call<RealtimeCountResponse>('POST', '/rec/now')
        .then(res => res.count)
        .catch(() => 0);

export const getTodayStats = async (): Promise<OccupantRecord[]> =>
    await call<HistoricalStatsResponse>('POST' ,'/rec/today')
        .then(res => res.data)
        .catch(() => []);

export const getTodayAverage = async (): Promise<OccupantRecord[]> =>
    await call<HistoricalStatsResponse>('POST', '/rec/today/avg')
        .then(res => res.data)
        .catch(() => []);

export const getDailyStats = async (
    dayOfWeek: keyof typeof DaysOfWeek,
    startDate?: moment.Moment
): Promise<DailyStatsRecord[]> => {
    let day = DaysOfWeek[dayOfWeek];
    let start = startDate?.format('YYYY-MM-DD') ?? undefined;
    let payload = { day, start };

    return await call<HistoricalStatsResponse<DailyStatsRecord>>('POST', '/rec/history/daily', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    .then(res => res.data)
    .catch(() => []);
}

export const getWeeklyStats = async () => 
    await call<HistoricalStatsResponse<WeeklyStatsRecord>>('POST', '/rec/history/weekly', {})
        .then(res => res.data)
        .catch(() => []);