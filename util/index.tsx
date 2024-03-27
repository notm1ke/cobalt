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