'use client';

import { useEffect, useState } from 'react';

export enum ExperimentType {
    TestDiningFavorites = 'test_dining_favorites'
}

type ExperimentSetup = {
    type: ExperimentType;
    displayName: string;
    description: string;
    constructionZone: boolean;
    defaultState: string;
    settings: Array<{
        option: string;
        value: string;
    }>;
}

export const Experiments: ExperimentSetup[] = [
    {
        type: ExperimentType.TestDiningFavorites,
        displayName: 'Dining Favorites Test',
        description: 'Render the random favorites testing box below the dining page title.',
        constructionZone: true,
        defaultState: 'false',
        settings: [
            { option: 'On', value: 'true' },
            { option: 'Off', value: 'false' }
        ]
    }
]

export type ExperimentState = {
    [key in ExperimentType]: string;
};

export const isDevelopmentMode = () => process.env.NEXT_PUBLIC_STAGE === 'dev';

export const isExperimentEnabled = (type: ExperimentType, treatment: string) => {
    if (!isDevelopmentMode())
        return false;

    if (typeof window === 'undefined')
        return false;   

    let experiments = localStorage.getItem('experiments');
    if (!experiments) return false;

    let repo = JSON.parse(experiments) as ExperimentState;
    let state = repo[type];
    if (!state) return false;
    
    return state === treatment;
}

const useDynamicExperiment = (type: ExperimentType, treatment: string) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        setEnabled(isExperimentEnabled(type, treatment));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return enabled;
}

interface ExperimentBoundaryProps {
    experiment: ExperimentType;
    treatment: string;
    children: React.ReactNode;
}

export const ExperimentBoundary: React.FC<ExperimentBoundaryProps> = ({ experiment, treatment, children }) => {
    const enabled = useDynamicExperiment(experiment, treatment);
    if (!enabled) return null;

    const opts = Experiments.find(e => e.type === experiment);
    if (!opts) return null;

    if (opts.constructionZone) return (
        <div className="p-3 border border-yellow-500 border-dashed">
            {children}
        </div>
    );

    return <>{children}</>;
}