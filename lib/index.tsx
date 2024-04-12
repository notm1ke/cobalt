'use server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const api = async (path: string) => process.env.BACKPLANE + path;

export const call = async <T,>(method: HttpMethod, url: string, opts: RequestInit = {}, invalidate = 60) =>
    await fetch(
        process.env.BACKPLANE + url,
        {
            method,
            ...optsWithCaching(opts, invalidate)
        }
    )
    .then(res => res.json() as T);

export const optsWithCaching = (opts: RequestInit, invalidate: number) => {
    if (opts.next && opts.next.revalidate) return opts;
    return { ...opts, next: { revalidate: invalidate } };
}