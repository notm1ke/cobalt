import { getDateFromTime } from '.';
import { OccupantRecord, WeeklyStatsRecord } from '~/lib/rec';

export const DaysOfWeek = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
};

export type RecHourEntry = {
    start: string;
    end: string;
    days: number[];
}

export enum RecFacility {
    SRC = 'Recreation Center',
    AQUATIC = 'Aquatic Center',
    CLIMB = 'Climbing Center',
    ADV = 'Adventure Center',
    ADMIN = 'Admin Offices'
}

const Weekdays = [1, 2, 3, 4, 5];
const Weekends = [0, 6];
const AllDays = [...Weekdays, ...Weekends];

export const StandardRecHours: Record<keyof typeof RecFacility, RecHourEntry[]> = {
    'SRC': [
        { start: '6:00am', end: '10:00pm', days: Weekdays },
        { start: '9:00am', end: '6:00pm', days: [6] },
        { start: '10:00am', end: '7:00pm', days: [0] }
    ],
    'AQUATIC': [
        { start: '6:00am', end: '8:30am', days: Weekdays },
        { start: '10:00am', end: '2:00pm', days: AllDays },
        { start: '4:00pm', end: '7:00pm', days: AllDays }
    ],
    'CLIMB': [
        { start: '12:00pm', end: '10:00pm', days: Weekdays.slice(0, 4) },
        { start: '12:00pm', end: '8:00pm', days: [5] },
        { start: '12:00pm', end: '4:00pm', days: [6] },
        { start: '6:00pm', end: '10:00pm', days: [0] }
    ],
    'ADV': [
        { start: '11:00am', end: '6:00pm', days: Weekdays },
        { start: '10:00am', end: '2:00pm', days: Weekends }
    ],
    'ADMIN': [
        { start: '9:00am', end: '5:00pm', days: Weekdays }
    ]
}

/**
 * Attempts to return the time until a given recreational facility closes.
 * 
 * @param facility the facility to query status for
 * @param now the time to query status for; defaults to now
 */
export const getTimeUntilRecClose = (facility: keyof typeof RecFacility, now = new Date()) => {
    const hours = StandardRecHours[facility];
    const day = now.getDay();
    const time = now.getHours();
    const statuses = hours
        .filter(({ days }) => days.includes(day))
        .map(ent => {
            let start = getDateFromTime(ent.start);
            let end = getDateFromTime(ent.end);
            return { status: time >= start.getHours() && time < end.getHours(), end: end.getTime() };
        });

    let isOpen = statuses.reduce((acc, cur) => acc || cur.status, false);
    if (isOpen) return statuses.find(e => e.status)!.end - now.getTime();

    return 0;
}

const getNearest15Min = (mins: number) => prependZero(Math.floor(mins / 15) * 15);

const prependZero = (num: number) => num < 10 ? `0${num}` : num;

const now = () => {
    let local = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    let date = new Date(local);

    return {
        day: date.getDay(),
        hour: date.getHours(),
        mins: date.getMinutes()
    };
}

export const getTypicalForTime = (avgs: OccupantRecord[]) => {
    let { hour, mins } = now();

    let am = hour < 12;
    let nearestFive = getNearest15Min(mins);
    let searchKey = `${hour % 12 === 0 ? hour : hour % 12}:${nearestFive} ${am ? 'AM' : 'PM'}`;

    return avgs.find(r => r.time === searchKey);
}

export type RecFacilityHours = {
    facility: keyof typeof StandardRecHours;
    open: string;
    close: string;
}

export const getHoursForToday = (): RecFacilityHours[] => {
    let day = new Date().getDay();
    let hours = Object.entries(StandardRecHours)
        .map(([facility, hours]) => {
            let today = hours.find(ent => ent.days.includes(day));
            if (!today) return null;

            return { facility, open: today.start, close: today.end };
        })
        .filter(e => e !== null);

    return hours as RecFacilityHours[];
}