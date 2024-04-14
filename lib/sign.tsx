import { call } from '.';

export type SignEntry = {
    title: string;
    description: string;
    lastBuildDate: string;
    items: SignEvent[];
}

export type SignEvent = {
    title: string;
    content: string;
}

type SiteSignsResponse = {
    sites: SignEntry[];
}

export const getSignsForSite = async (site: string): Promise<SignEntry[]> =>
    await call<SiteSignsResponse>('GET', `/sign/site/${site}`)
        .then((res) => res.sites)
        .catch(() => []);