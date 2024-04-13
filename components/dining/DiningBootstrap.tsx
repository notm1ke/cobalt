'use client';

import { getMenus } from '~/lib/dining';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { useIsClient } from '@uidotdev/usehooks';
import { DiningMenusContent } from './DiningContent';
import { DiningHallResponse } from '@ilefa/blueplate';
import { DiningFavoritesProvider } from './DiningFavorites';
import { RandomFavoriteExperiment } from './experiment/RandomFavorites';
import { ExperimentBoundary, ExperimentType } from '~/util/experiments';

export const DiningBootstrap: React.FC = () => {
    const [menus, setMenus] = useState<DiningHallResponse[]>();
    
    useEffect(() => {
        getMenus().then(setMenus);
    }, []);

    const client = useIsClient();
    if (!client) return null;

    return (
        <DiningFavoritesProvider>
            <div className="container relative">
                <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                    <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                        Dining Halls
                    </h1>

                    <ExperimentBoundary experiment={ExperimentType.TestDiningFavorites} treatment="true">
                        <p suppressHydrationWarning className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                            <RandomFavoriteExperiment menus={menus} />
                        </p>
                    </ExperimentBoundary>
                </section>
                <section className="mx-auto flex flex-col items-center mt-3 py-8">
                    <div className="flex flex-col gap-10 w-full md:flex-row">
                        {
                            !menus && (
                                <Skeleton className="w-full h-[300px]" />
                            )
                        }

                        {
                            menus && (
                                <DiningMenusContent menus={menus} />
                            )
                        }
                    </div>
                </section>
            </div>
        </DiningFavoritesProvider>
    )
}