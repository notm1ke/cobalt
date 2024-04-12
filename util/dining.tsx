import moment from 'moment';

import { getLatestTimeValue } from '.';

import {
    ActiveDiningStatuses,
    DiningHallHours,
    DiningHallResponse,
    DiningHallType
} from '@ilefa/blueplate';

/**
 * Returns a DDS link for the given dining hall / date.
 * 
 * @param hall the dining hall to get the url for
 * @param date the date of the menu
 */
export const generateDdsLink = (hall: DiningHallResponse, date = new Date()) => {
    let url = `http://nutritionanalysis.dds.uconn.edu/shortmenu.aspx?sName=UCONN+Dining+Services&locationNum=${hall.location.id}&locationName=${hall.location.name}&naFlag=1`;
    if (date.getMonth() !== new Date().getMonth()
        || date.getFullYear() !== new Date().getFullYear()
        || date.getDate() !== new Date().getDate())
            url += `&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=${moment(date).format('MM')}%2f${date.getDate()}%2f${date.getFullYear()}`;

    return url;
}

export const getTimingForPhase = (
    hall: keyof typeof DiningHallType,
    phase: keyof typeof ActiveDiningStatuses
) => {
    let hours = DiningHallHours[hall][phase];
    if (!hours) return 'Unknown';

    let today = new Date().getDay();
    let target = hours.find(time => time.days.includes(today));
    if (!target) return 'Unknown';

    return `${target.start} - ${target.end}`;
}

export const getRemainingTimeForPhase = (hall: DiningHallResponse) => {
    let phase = hall.status;
    if (phase === 'BETWEEN_MEALS' || phase === 'CLOSED')
        return null;

    let schedule = DiningHallHours[hall.type];
    if (!schedule) return null;

    // figure out the end time for the current phase
    let times = schedule[phase as keyof typeof ActiveDiningStatuses];
    if (!times) return null;

    let today = new Date().getDay();
    let target = times.find(time => time.days.includes(today));
    if (!target) return null;

    let now = moment();
    let end = moment(target.end, 'HH:mm A');
    let diff = end.diff(now, 'milliseconds')

    return getLatestTimeValue(diff, 3);
}

export const getTimeUntilReopened = (hall: DiningHallResponse) => {
    let phase = hall.status;
    if (phase !== 'CLOSED' && phase !== 'BETWEEN_MEALS')
        return null;

    let schedule = DiningHallHours[hall.type];
    if (!schedule) return null;

    let today = new Date().getDay();
    if (phase === 'CLOSED') {
        // check if before breakfast or after dinner, that way we can determine the time until the next meal
        let breakfast = schedule['BREAKFAST'].find(time => time.days.includes(today));
        let dinner = schedule['DINNER'].find(time => time.days.includes(today));

        let now = moment();
        let openingTime = moment(breakfast?.start, 'HH:mm A');

        if (now.isAfter(openingTime)) {
            // find the next morning's breakfast
            let nextDay = (today + 1) % 7;
            breakfast = schedule['BREAKFAST'].find(time => time.days.includes(nextDay));
            openingTime = moment(breakfast?.start, 'HH:mm A');
            return openingTime.format('h:mm A');
        }

        return openingTime.format('h:mm A');
    }

    // figure out which between meals phase we're in
    let nextPhase = 'BREAKFAST';
    if (phase === 'BETWEEN_MEALS') {
        let now = moment();
        let breakfast = schedule['BREAKFAST'].find(time => time.days.includes(today));
        let lunch = schedule['LUNCH'].find(time => time.days.includes(today));
        let dinner = schedule['DINNER'].find(time => time.days.includes(today));

        if (now.isBefore(moment(breakfast?.start, 'HH:mm A'))) {
            nextPhase = 'BREAKFAST';
        } else if (now.isBefore(moment(lunch?.start, 'HH:mm A'))) {
            nextPhase = 'LUNCH';
        } else if (now.isBefore(moment(dinner?.start, 'HH:mm A'))) {
            nextPhase = 'DINNER';
        } else {
            let nextDay = (today + 1) % 7;
            breakfast = schedule['BREAKFAST'].find(time => time.days.includes(nextDay));
            nextPhase = 'BREAKFAST';
        }

        let nextPhaseTimes = schedule[nextPhase as keyof typeof ActiveDiningStatuses].find(time => time.days.includes(today));
        let openingTime = moment(nextPhaseTimes?.start, 'HH:mm A');
        return openingTime.format('h:mm A');
    }
}

export type GroupedMeals = Record<string, FoodOption[]>;

export type FoodOption = {
    name: string;
    hall: Array<keyof typeof DiningHallType>;
}

export const groupByMeal = (menus: DiningHallResponse[]): GroupedMeals => {
    let meals = menus.reduce((prev, cur) => {
        cur.meals.forEach(meal => {
            if (!prev[meal.name]) prev[meal.name] = [];
            let stations = meal.stations instanceof Array
                ? meal.stations
                : [meal.stations];

            stations.forEach(station => {
                station.options.forEach(option => {
                    prev[meal.name].push({ name: option, hall: [cur.type] });
                })
            })
        });

        // merge duplicates
        Object.keys(prev).forEach(meal => {
            let unique = prev[meal].reduce((acc, cur) => {
                let existing = acc.find(a => a.name === cur.name);
                if (existing) {
                    existing.hall.push(cur.hall[0]);
                } else {
                    acc.push(cur);
                }

                return acc;
            }, [] as FoodOption[]);

            prev[meal] = unique;
        });

        return prev;
    }, {} as GroupedMeals);

    return meals;
}