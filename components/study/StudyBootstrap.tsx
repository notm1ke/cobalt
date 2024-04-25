'use client';

import { Floor } from '@ilefa/bluestudy';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { StudySpaceCard } from './StudySpaceCard';
import { StudySpace, getAvailabilities } from '~/lib/study';

const spaceSorter = (a: StudySpace, b: StudySpace) => {
    let cleanName = (name: string) => {
        if (name.startsWith('Individual'))
            return name.split('Individual Study Room ')[1];
        return name;
    }
    
    let aFloor = parseInt(Floor[a.floor]);
    let bFloor = parseInt(Floor[b.floor]);
    
    if (aFloor !== bFloor)
        return aFloor - bFloor;
    
    let aName = cleanName(a.name);
    let bName = cleanName(b.name);

    return aName.localeCompare(bName);
}

export const StudyBootstrap: React.FC = () => {
    const [spaces, setSpaces] = useState<StudySpace[]>();
    
    useEffect(() => {
        getAvailabilities().then(setSpaces);
    }, []);

    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                    Study Spaces
                </h1>
            </section>
            <section className="mx-auto flex flex-col items-center mt-3 py-8">
                <div className="flex flex-col gap-10 w-full md:flex-row">
                    {
                        !spaces && (
                            <Skeleton className="w-full h-[300px]" />
                        )
                    }

                    {
                        spaces && (
                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                {
                                    spaces.sort(spaceSorter).map(space => (
                                        <StudySpaceCard key={space.id} space={space} />
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}