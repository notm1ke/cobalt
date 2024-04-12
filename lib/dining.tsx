'use server';

import { call } from '.';
import { DiningHallResponse } from '@ilefa/blueplate';

type MenusResponse = {
    menus: DiningHallResponse[];
}

export const getMenus = async (): Promise<DiningHallResponse[]> => 
    await call<MenusResponse>('GET', '/dining/menus')
        .then(res => res.menus)
        .catch(() => []);