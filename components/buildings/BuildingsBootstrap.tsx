'use client';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { BuildingCard } from './BuildingCard';
import { Card, CardContent } from '../ui/card';
import { Popover } from '@radix-ui/react-popover';
import { BuildingListing, getBuildings } from '~/lib/buildings';
import { PopoverContent, PopoverTrigger } from '../ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { mdiAlert, mdiCloseCircle, mdiFlag, mdiTownHall } from '@mdi/js';
import { MdiIcon, ResidentialBuildings, Sites, capitalizeFirst, css } from '~/util';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

type Filterable = {
    key: string;
    displayName: string;
    filter: (building: BuildingListing) => boolean;
}

const BuildingFilters: Filterable[] = [
    {
        key: 'academic',
        displayName: 'Academic',
        filter: building => building.statistics.classrooms > 0
    },
    {
        key: 'residential',
        displayName: 'Residential',
        filter: building => ResidentialBuildings.includes(building.code as any)
    }
]

const CampusFilters: Filterable[] = Object
    .keys(Sites)
    .map(site => ({
        key: site,
        displayName: capitalizeFirst(site.replace(/_/g, ' ')),
        filter: building => building.campus === site
    }));

type FilterSelectorProps = {
    icon: JSX.Element;
    label: string;
    searchLabel?: string;
    filters: Filterable[];
    active: string;
    setter: (value: string) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
    icon,
    label,
    searchLabel,
    filters,
    active,
    setter
}) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="default"
                role="combobox"
                className="text-gray-700 h-[46px]"
            >
                {icon}{" "}
                {label}
                
                {
                    !active && <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                }
                
                {
                    active && (
                        <div onClick={() => setter('')}>
                            <MdiIcon path={mdiCloseCircle} size="15px" className="mt-[2px] opacity-50 ml-2 hover:opacity-100" />
                        </div>
                    )
                }
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandInput placeholder={searchLabel || 'Search filter types'} className="h-9" />
                <CommandList>
                    <CommandGroup>
                        {
                            filters.map(filter => (
                                <CommandItem
                                    key={filter.key}
                                    value={filter.key}
                                    onSelect={() => {
                                        if (filter.key === active)
                                            return setter('');
                                        setter(filter.key);
                                    }}
                                >
                                    {filter.displayName}
                                    <CheckIcon
                                        className={css(
                                            "ml-auto h-4 w-4",
                                            filter.key === active
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
)

export const BuildingsBootstrap: React.FC = () => {
    const [buildings, setBuildings] = useState<BuildingListing[]>([]);

    // search
    const [query, setQuery] = useState<string>('');
    const [filtered, setFiltered] = useState<BuildingListing[]>([]);

    // filters
    const [campus, setCampus] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');

    useEffect(() => {
        getBuildings(false).then(setBuildings);
    }, []);

    const enabled = buildings && buildings.length > 0;
    useEffect(() => {
        if (!enabled) return;
        setFiltered(buildings!);
    }, [enabled]);

    useEffect(() => {
        let items = filter(query);
        if (!campus && !filterType) return setFiltered(items);
        
        let buildingFilter = BuildingFilters.find(filter => filter.key === filterType)?.filter;
        let campusFilter = CampusFilters.find(filter => filter.key === campus)?.filter;
        
        if (campus && filterType) items = items.filter(item => buildingFilter!(item) && campusFilter!(item));
        else if (campus && !filterType) items = items.filter(campusFilter!);
        else if (!campus && filterType) items = items.filter(buildingFilter!);
        
        return setFiltered(items);
    }, [query, campus, filterType]);

    // useEffect(() => {
    //     let items = filter(query);
    //     if (!filterType) return setFiltered(items);

    //     items = items.filter(BuildingFilters.find(filter => filter.key === filterType)!.filter);
    //     setFiltered(items);
    // }, [filterType]);

    const filter = (query: string) => {
        if (!query || !query.length || !query.trim().length)
            return buildings!;

        let lower = query.toLowerCase();
        let filtered = buildings!.filter(building => {
            let name = building.name.toLowerCase();
            let code = building.code.toLowerCase();
            return name.includes(lower) || code.includes(lower);
        });

        return filtered;
    }

    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-4xl font-extrabold leading-tight tracking-tighter lg:leading-[1.1] mb-3">
                    Buildings
                </h1>

                <p suppressHydrationWarning className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                    Explore {buildings && buildings.length > 0 && buildings.length} buildings across all of UConn.
                </p>
            </section>
            <section className="mx-auto flex flex-col items-center mt-3 py-8">
                <div className="flex flex-col gap-10 w-full md:flex-row">
                    {
                        !buildings || buildings.length === 0 && (
                            <Skeleton className="w-full h-[300px]" />
                        )
                    }

                    {
                        buildings.length > 0 && (
                            <div>
                                <div className="flex max-w w-full items-center space-x-2 mb-9">
                                    {/* todo: fix for mobile */}
                                    <Input
                                        type="string"
                                        value={query}
                                        placeholder="Search.."
                                        className="bg-gray-700 h-12"
                                        onChange={(e) => setQuery(e.target.value)}
                                    />

                                    <FilterSelector
                                        label="Campus"
                                        searchLabel="Search campus"
                                        icon={<MdiIcon path={mdiFlag} size="17px" className="inline mr-2" />}
                                        filters={CampusFilters}
                                        active={campus}
                                        setter={setCampus}
                                    />

                                    <FilterSelector
                                        label="Building Type"
                                        searchLabel="Search building type"
                                        icon={<MdiIcon path={mdiTownHall} size="17px" className="inline mr-2" />}
                                        filters={BuildingFilters}
                                        active={filterType}
                                        setter={setFilterType}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                                    {
                                        filtered.map(building => (
                                            <BuildingCard
                                                key={building.code}
                                                building={building}
                                            />
                                        ))
                                    }

                                    {
                                        !filtered.length && (
                                            <>
                                                <div className="col-span-1"></div>
                                                <Card className="bg-white shadow-lg rounded-lg">
                                                    <div className="bg-red-400 p-6 flex items-center justify-center rounded-t-lg rounded-b-none">
                                                        <MdiIcon path={mdiAlert} size="28px" color="white" />
                                                    </div>
                                                    <CardContent>
                                                        <h3 className="text-lg font-mono font-bold tracking-tighter text-gray-700 mt-5">
                                                            No results found
                                                        </h3>

                                                        <p className="text-sm text-gray-700 mt-2">
                                                            There are no matching buildings for the search criteria provided. Please try broadening your search, or checking for typos.
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                                <div className="col-span-1"></div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    )
}