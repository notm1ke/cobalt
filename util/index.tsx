import MdiIcon from '@mdi/react';
import * as MdiIcons from '@mdi/js';

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { mdiVectorDifference } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { GroupedBy } from './types';

export const SITE_LOGO = mdiVectorDifference;
export const MdiRepo = MdiIcons as Record<string, string>;

export * from './buildings';
export * from './course';
export * from './icons';
export * from './rec';
export * from './types';
export { MdiIcon };

export const css = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getEnv = () => process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';

export type PickFunction<TInput> = (input: TInput) => boolean;

export type UnwrapPickFunction<TInput> = TInput extends PickFunction<infer TFuncArg>
    ? TFuncArg
    : TInput;

export type PickerParam<TInput, TOutput = TInput> = {
    pick: TInput;
    value: (input: UnwrapPickFunction<TInput>) => TOutput
}

export const isPickFunction = <In,>(pick: In | PickFunction<In>): pick is PickFunction<In> => typeof pick === 'function';

export const picker = <In, Out = In>(params: PickerParam<In, Out>[]) => {
    const filterByPick = (pick: In | PickFunction<In>, val: UnwrapPickFunction<In>) => {
        if (isPickFunction(pick))
            return pick(val as any);
        return pick === val;
    }

    return (input: UnwrapPickFunction<In>) => {
        if (typeof input === 'number') {
            // try finding exact
            let i = input as number;
            let exact = params.find(p => filterByPick(p.pick, input));
            if (exact) return exact.value(input as any);

            // then match closest (useful for range lookup)
            let closest = params.sort((a, b) => {
                if (isPickFunction(a.pick) || isPickFunction(b.pick))
                    throw new Error('Cannot use both pick function and number matching.');

                let aPick = a.pick as number;
                let bPick = b.pick as number;
                return Math.abs(aPick - i) - Math.abs(bPick - i);
            });

            return closest[0].value(input as any);
        }

        const match = params.find(p => filterByPick(p.pick, input));
        if (!match) return null;
        return match.value(input as any);
    }
}

export const safeJsonParse = <T,>(input?: string | null) => {
    try {
        if (!input) return null;
        return JSON.parse(input) as T;
    } catch (_err) {
        return null;
    }
}

export type MdiWrapperProps = IconProps & {
    path: keyof typeof MdiIcons;
    size?: number | string;
    color?: string;
    divWrapped?: boolean;
}

export const MdiWrapper = ({ path, size, color, divWrapped, ...props }: MdiWrapperProps) => {
    let iconComponent = <MdiIcon path={MdiRepo[path]} size={size} color={color} {...props} />;
    if (divWrapped) return (
        <div className="inline">
            {iconComponent}
        </div>
    )
    
    return iconComponent;
};

/**
 * Shortens an inputted string to a specified length
 * by trimming at the max length and adding ellipses.
 * 
 * @param input the input string
 * @param maxLen the maximum allowed length
 */
export const shortenWithEllipses = (input: string, maxLen: number) => {
    if (input.length <= maxLen)
        return input;
    return input.slice(0, maxLen - 2) + '..';
}

/**
 * Shortens an inputted name by substituting
 * the last name with it's initial.
 * 
 * @param input the inputted name
 * @param maxLen the maximum allowed length before shortening
 * @param trailingDot whether to add a trailing dot to the last name
 */
export const shortenName = (input: string, maxLen: number, trailingDot: boolean = true) => {
    if (input.length <= maxLen)
        return input;

    return input
        .split(' ')
        .map((part, i, arr) => i !== arr.length - 1
            ? part
            : part[0] + (trailingDot 
                ? '.'
                : ''))
        .join(' ');
}

/**
 * Capitalizes the first letter of all words in a string.
 * @param input the input string
 */
export const capitalizeFirst = (input: string) => input
    .split(' ')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ');

/**
 * Replaces all occurances of a given
 * search string within another string.
 * 
 * @param input the input string
 * @param search the string to replace
 * @param replace what to replace it with
 */
export const replaceAll = (input: string, search: string | RegExp, replace: string) => {
    let copy = String(input);
    if (search instanceof RegExp) {
        if (!search.test(copy))
            return copy;

        while (search.test(copy))
            copy = copy.replace(search, replace);

        return copy;
    }

    if (!copy.includes(search))
        return copy;

    while (copy.includes(search))
        copy = copy.replace(search, replace);

    return copy;
}

/**
 * Groups elements by a given key.
 * 
 * @param xs the elements to group
 * @param key the key to group them by
 */
export const groupBy = <T,>(xs: T[], key: keyof T): GroupedBy<T> => xs.reduce((rv, x) => {
    let rvKey = x[key as keyof T] as string;
    (rv[rvKey] = rv[rvKey] || []).push(x);
    return rv;
}, {} as Record<string, T[]>);

/**
 * Joins an array and places 'and' between the last two items.
 * 
 * @param arr the array to join
 * @param delimiter the delimiter to use
 */
export const joinWithAnd = (arr: any[], delimiter: string = ', ') => {
    if (arr.length === 0)
        return '';
    if (arr.length === 1)
        return arr[0];
    if (arr.length === 2)
        return arr.join(' and ');
    return arr.slice(0, -1).join(delimiter) + ' and ' + arr.slice(-1);
}

/**
 * Given a time like "9:00 PM", returns
 * a date object containing the time,
 * and optionally from a given initial
 * date.
 * 
 * @param time the time to convert
 * @param date the initial date (or now)
 */
export const getDateFromTime = (time: string, date = new Date()) => {
    let offset = time.split(':')[0].length;
    let hours = parseInt(time.substring(0, offset));
    if (hours !== 12 && time.toLowerCase().includes('pm'))
        hours += 12;

    return new Date(date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    hours,
                    parseInt(time.substring(offset + 1, offset + 3)),
                    0, 0);
}

/**
 * Retrieves the formatted duration string
 * for the given millis duration input.
 * 
 * @param time the time in milliseconds
 */
export const getLatestTimeValue = (time: number, top?: number) => {
    let sec = Math.trunc(time / 1000) % 60;
    let min = Math.trunc(time / 60000 % 60);
    let hrs = Math.trunc(time / 3600000 % 24);
    let days = Math.trunc(time / 86400000 % 30.4368);
    let mon = Math.trunc(time / 2.6297424E9 % 12.0);
    let yrs = Math.trunc(time / 3.15569088E10);

    let y = `${yrs}y`;
    let mo = `${mon}mo`;
    let d = `${days}d`;
    let h = `${hrs}h`;
    let m = `${min}m`;
    let s = `${sec}s`;

    let result = '';
    if (yrs !== 0) result += `${y}, `;
    if (mon !== 0) result += `${mo}, `;
    if (days !== 0) result += `${d}, `;
    if (hrs !== 0) result += `${h}, `;
    if (min !== 0) result += `${m}, `;
    
    result = result.substring(0, Math.max(0, result.length - 2));
    if ((yrs !== 0 || mon !== 0 || days !== 0 || min !== 0 || hrs !== 0) && sec !== 0) {
        result += ', ' + s;
    }

    if (yrs === 0 && mon === 0 && days === 0 && hrs === 0 && min === 0) {
        result += s;
    }

    if (top) return result
        .trim()
        .split(', ')
        .slice(0, top)
        .join(', ');

    return result.trim();
}