'use server';

import { call } from '.';
import { groupBy } from '~/util';
import { AvailabilityRecord, Room, getRoomById } from '@ilefa/bluestudy';

type AvailableSpacesResponse = {
    available: AvailabilityRecord[];
}

export type StudySpace = Room & {
    availability: AvailabilityRecord[];
}

export const getAvailabilities = async (): Promise<StudySpace[]> =>  {
    let availabilities = await call<AvailableSpacesResponse>('GET', `/study/available`)
        .then(res => res.available)
        .catch(() => []);

    let ids = groupBy(availabilities, 'roomId');
    return Object
        .entries(ids)
        .map(([id, availability]) => ({
            ...getRoomById(parseInt(id)),
            availability
        })) as StudySpace[];
}

export const getAvailabilityForSpace = async (roomLike: string): Promise<AvailabilityRecord[]> =>
    await call<AvailableSpacesResponse>('GET', `/study/available/${roomLike}`)
        .then(res => res.available)
        .catch(() => []);