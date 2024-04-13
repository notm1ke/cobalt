import { Card, CardContent } from '~/components/ui/card';
import { Dispatch, SetStateAction, useState } from 'react';
import { FavoritesAction, useFavorites } from './DiningFavorites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { MdiIcon, css, getIconForDiningHall, getIconForDiningStatus, picker } from '~/util';

import {
    ActiveDiningStatuses,
    DiningHallResponse,
    DiningHallStatus,
    DiningHallType
} from '@ilefa/blueplate';

import {
    generateDdsLink,
    getRemainingTimeForPhase,
    getTimeUntilReopened,
    getTimingForPhase,
    groupByMeal
} from '~/util/dining';

import {
    mdiCityVariantOutline,
    mdiFoodForkDrink,
    mdiFoodSteak,
    mdiLink,
    mdiMap,
    mdiMoonWaningCrescent,
    mdiRefresh,
    mdiStar,
    mdiStarOffOutline,
    mdiSunAngle,
    mdiWeatherSunny
} from '@mdi/js';

export type SelectedDiningHall = keyof typeof DiningHallType | 'ALL';

export interface DiningMenusContentProps {
    menus: DiningHallResponse[];
}

type Tab = {
    name: string;
    icon: JSX.Element;
    key: string;
}

type DiningHallKey = keyof typeof DiningHallType;

const getDiningHalls = (): DiningHallKey[] => Object.keys(DiningHallType) as DiningHallKey[];

const TabRegistry: Tab[] = [
    {
        name: 'All',
        icon: <MdiIcon path={mdiCityVariantOutline} size="18px" className="inline align-text-top" />,
        key: 'ALL',
    },
    ...getDiningHalls().map(hall => ({
        name: DiningHallType[hall],
        icon: getIconForDiningHall(hall, 'inline align-text-top', 18),
        key: hall,
    }))
];

const statusIndicator = picker<keyof typeof DiningHallStatus, JSX.Element>([
    {
        pick: 'CLOSED',
        value: () => <span className="text-red-400">Closed</span>
    },
    {
        pick: 'BETWEEN_MEALS',
        value: () => (
            <span className="text-orange-400">
                <MdiIcon path={mdiRefresh} size="18px" className="inline align-sub" />{" "}
                Resetting
            </span>
        )
    },
    {
        pick: 'LATE_NIGHT',
        value: () => (
            <span className="text-blue-400">
                <MdiIcon path={mdiMoonWaningCrescent} size="18px" rotate={-40} className="inline align-text-bottom mr-1" />{" "}
                Late Night
            </span>
        )
    },
    {
        pick: 'BREAKFAST',
        value: () => (
            <span className="text-orange-300">
                <MdiIcon path={mdiWeatherSunny} size="18px" className="inline align-text-top mr-1" />
                Breakfast
            </span>
        )
    },
    {
        pick: 'BRUNCH',
        value: () => (
            <span className="text-orange-400">
                <MdiIcon path={mdiSunAngle} size="18px" className="inline align-text-top mr-1" />
                Brunch
            </span>
        )
    },
    {
        pick: 'LUNCH',
        value: () => (
            <span className="text-blue-400">
                <MdiIcon path={mdiFoodForkDrink} size="18px" className="inline align-sub mr-1" />
                Lunch
            </span>
        )
    },
    {
        pick: 'DINNER',
        value: () => (
            <span className="text-blue-400">
                <MdiIcon path={mdiFoodSteak} size="18px" className="inline align-middle mr-1" />
                Dinner
            </span>
        )
    }
])

const favoritesIndicator = (favorites: string[], menu: DiningHallResponse) => {
    let stations = menu.meals.flatMap(meal => meal.stations);
    let food = [...new Set(stations.flatMap(station => station.options))];
    let amount = food.filter(f => favorites.includes(f)).length;
    if (amount === 0) return (
        <span className="text-gray-500 mt-1">
            <MdiIcon path={mdiStarOffOutline} size="18px" className="inline align-sub mr-1 text-red-400" />
            No favorites served here.
        </span>
    )

    return (
        <span className="text-yellow-500 mt-1">
            <MdiIcon path={mdiStar} size="18px" className="inline align-sub mr-1" />
            {amount} favorite{amount > 1 ? 's' : ''} <span className="text-gray-600">served here.</span>
        </span>
    )
}

const DiningHallsGrid: React.FC<{
    favorites: string[],
    hall: DiningHallResponse,
    setActive: Dispatch<SetStateAction<SelectedDiningHall>>
}> = ({ favorites, hall, setActive }) => {
    let remaining = getRemainingTimeForPhase(hall);
    let until = getTimeUntilReopened(hall);

    return (
        <Card className="bg-white text-gray-700 p-3 border-none shadow-lg">
            <CardContent className="mt-5">
                <h2
                    className="text-lg text-blue-500 hover:text-blue-500/60 font-bold font-mono mb-2 cursor-pointer"
                    onClick={() => setActive(hall.type as SelectedDiningHall)}
                >
                    {DiningHallType[hall.type]}
                </h2>

                <p>
                    {statusIndicator(hall.status)}
                    {
                        remaining !== null && (
                            <span className="text-gray-500">
                                {" "}for another <span className="font-semibold">{remaining}</span>.
                            </span>
                        )
                    }
                    {
                        until !== null && (
                            <span className="text-gray-500">
                                {" "}until {
                                    // detect if it is a time or a status indicator
                                    /[0-9]*:[0-9]*\s(AM|PM)/.test(until!)
                                        ? <span className="font-semibold">{until}</span>
                                        : until
                                }.
                            </span>
                        )
                    }
                </p>

                <p>
                    {favoritesIndicator(favorites, hall)}
                </p>
            </CardContent>
        </Card>
    )
}

type AllFoodProps = {
    favorites: string[];
    menus: DiningHallResponse[];
}

const AllDiningHallsContent: React.FC<
    AllFoodProps & {
        dispatch: Dispatch<FavoritesAction>,
        setActive: Dispatch<SetStateAction<SelectedDiningHall>>
    }
> = ({ favorites, menus, dispatch, setActive }) => {
    let allFood = groupByMeal(menus);

    return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {
                        menus.map(hall => (
                            <DiningHallsGrid
                                key={hall.type}
                                favorites={favorites}
                                setActive={setActive}
                                hall={hall}
                            />
                        ))
                    }
                </div>

                <div className="border-t border-gray-200 mt-11 mb-9" />

                <h2 className="text-xl text-blue-400 font-bold font-mono mt-5 mb-2">
                    All Food
                </h2>

                <div className="grid grid-cols-3 xs:grid-cols-1 gap-4 mt-4">
                    {
                        Object.entries(allFood).map(([meal, food]) => (
                            <div key={meal}>
                                <h3 className="text-blue-500 font-bold font-mono text-lg">
                                    {meal}
                                </h3>
                                <ul className="mt-2">
                                    {
                                        food.sort((a, b) => a.name.localeCompare(b.name)).map(option => (
                                            <TooltipProvider key={option.name}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <li
                                                            key={option.name}
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                dispatch({ type: 'toggle', payload: option.name });
                                                            }}
                                                            className={
                                                                css('cursor-pointer',
                                                                    favorites.includes(option.name)
                                                                        ? 'text-yellow-500'
                                                                        : 'text-gray-700'
                                                                )
                                                            }
                                                        >
                                                            {option.name}
                                                        </li>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-sm text-gray-700">
                                                            Served at <span className="font-semibold">{[...new Set(option.hall)].map(h => DiningHallType[h]).join(', ')}</span>.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}

const TabTarget: React.FC<{
    active: SelectedDiningHall,
    setActive: Dispatch<SetStateAction<SelectedDiningHall>>,
    menus: DiningHallResponse[]
}> = ({ active, menus, setActive }) => {
    const [favorites, dispatch] = useFavorites();

    if (active === 'ALL') return (
        <AllDiningHallsContent
            favorites={favorites}
            dispatch={dispatch}
            setActive={setActive}
            menus={menus}
        />
    );

    let target = menus.find(menu => menu.type === active);
    if (!target) return <></>;

    let remaining = getRemainingTimeForPhase(target);
    let untilOpen = getTimeUntilReopened(target);

    return (
        <Card className="bg-white text-gray-700 p-3 rounded-t-none">
            <CardContent className="mt-5 mb-2">
                <div className="mb-3">
                    <h2 className="text-lg text-blue-500 font-bold font-mono mb-2">
                        {DiningHallType[active]} Dining Hall

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        className="ml-3 text-blue-400 cursor-pointer"
                                        href={generateDdsLink(target)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MdiIcon path={mdiLink} size="23px" className="inline align-sub" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm text-gray-700">
                                        Open in Dining Services Website
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        className="ml-3 text-blue-400 cursor-pointer"
                                        href={target.location.maps}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MdiIcon path={mdiMap} size="23px" className="inline align-sub" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm text-gray-700">
                                        View in Google Maps
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </h2>

                    <p>
                        {statusIndicator(target.status)}{" "}
                        {remaining !== null && (
                            <span className="text-gray-500">
                                for another <span className="font-semibold">{remaining}</span>.
                            </span>
                        )}
                        {untilOpen !== null && (
                            <span className="text-gray-500">
                                until <span className="font-semibold">{untilOpen}</span>.
                            </span>
                        )}
                    </p>

                    <p>
                        {favoritesIndicator(favorites, target)}
                    </p>

                    {/* stations view */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {
                            target
                                .meals
                                .filter(meal => meal.stations?.length > 0)
                                .map(meal => (
                                    <div key={meal.name} className="mt-4">
                                        <h3 className="text-blue-500 font-bold font-mono text-lg">
                                            {
                                                getIconForDiningStatus(
                                                    meal.name as keyof typeof ActiveDiningStatuses,
                                                    'inline align-middle mr-2',
                                                    18
                                                )
                                            }

                                            {meal.name}{" "}
                                            <span className="text-[16px]  font-normal tracking-tighter">
                                                ({getTimingForPhase(
                                                    target.type,
                                                    meal
                                                        .name
                                                        .toUpperCase()
                                                        .replace(/\s/g, '_') as keyof typeof ActiveDiningStatuses
                                                )})
                                            </span>
                                        </h3>
                                        <div className="mt-2">
                                            {
                                                (meal && meal.stations && meal.stations.length) && meal.stations.map((station, i, arr) => (
                                                    <div key={station.name} className={css('mt-2', i !== arr.length - 1 && 'mb-4')}>
                                                        <h4 className="text-blue-400 font-bold font-mono text-[17px]">
                                                            {station.name}
                                                        </h4>
                                                        <ul className="mt-2">
                                                            {
                                                                station.options.map(option => (
                                                                    <li
                                                                        key={option}
                                                                        onClick={e => {
                                                                            e.preventDefault();
                                                                            dispatch({ type: 'toggle', payload: option });
                                                                        }}
                                                                        className={
                                                                            css('cursor-pointer',
                                                                                favorites.includes(option)
                                                                                    ? 'text-yellow-500'
                                                                                    : 'text-gray-700'
                                                                            )
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const DiningMenusContent: React.FC<DiningMenusContentProps> = ({ menus }) => {
    const [active, setActive] = useState('ALL' as SelectedDiningHall);

    return (
        <Tabs value={active} defaultValue="ALL" className="w-full">
            <TabsList className="h-14 w-full rounded-b-none">
                {
                    TabRegistry.map(tab => (
                        <TabsTrigger key={tab.key} value={tab.key}>
                            <div
                                className="flex items-center space-x-2 mx-4 h-6"
                                onClick={() => setActive(tab.key as SelectedDiningHall)}
                            >
                                {tab.icon}
                                <span className="hidden md:inline">{tab.name}</span>
                            </div>
                        </TabsTrigger>
                    ))
                }
            </TabsList>
            {
                TabRegistry.map(tab => (
                    <TabsContent value={tab.key} key={tab.key} className="mt-0">
                        <TabTarget
                            active={tab.key as SelectedDiningHall}
                            setActive={setActive}
                            menus={menus}
                        />
                    </TabsContent>
                ))
            }
        </Tabs>
    )
}