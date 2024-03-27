'use client';

import { ContentArea, CourseMapping } from '@ilefa/husky';
import { getSearchCompletions } from '~/lib/search';
import { useEffect, useRef, useState } from 'react';
import { useClickBoundary, useDebounce } from '~/hooks';

import {
    MdiIcon,
    css,
    getIconForCourse,
    hasContentArea,
    isGradLevel
} from '~/util';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from './ui/command';

import {
    mdiAlphaGBox,
    mdiAlphaHBox,
    mdiBeakerOutline,
    mdiFileDocumentEditOutline,
    mdiMagnify,
    mdiNumeric1Box,
    mdiNumeric2Box,
    mdiNumeric3Box,
    mdiNumeric4Box,
    mdiNumeric4BoxMultiple
} from '@mdi/js';
import { useRouter } from 'next/navigation';

type StringOrElement = string | JSX.Element;

type HighlightedSearchComponents = {
    name: StringOrElement;
    catalogName: StringOrElement;
}

type AttributeSymbol = {
    icon: string;
    color?: string;
    size?: string;
}

const renderSymbols = (course: CourseMapping) => {
    let symbols: AttributeSymbol[] = [];
    if (course.attributes.lab)
        symbols.push({ icon: mdiBeakerOutline });

    if (course.attributes.writing)
        symbols.push({ icon: mdiFileDocumentEditOutline });

    if (course.grading === 'Honors Credit')
        symbols.push({ icon: mdiAlphaHBox, color: 'text-red-400' });

    if (hasContentArea(course, ContentArea.CA1))
        symbols.push({ icon: mdiNumeric1Box });

    if (hasContentArea(course, ContentArea.CA2))
        symbols.push({ icon: mdiNumeric2Box });

    if (hasContentArea(course, ContentArea.CA3))
        symbols.push({ icon: mdiNumeric3Box });

    if (hasContentArea(course, ContentArea.CA4))
        symbols.push({ icon: mdiNumeric4Box });

    if (hasContentArea(course, ContentArea.CA4INT))
        symbols.push({ icon: mdiNumeric4BoxMultiple });

    if (isGradLevel(course.name.split(/\d/)[0], parseInt(course.name.split(/(\d{3,4})/)[1])))
        symbols.push({ icon: mdiAlphaGBox, color: 'text-green-600' });

    return (
        <>
            {
                symbols.map((symbol, i) => (
                    <div className="self-end content-end justify-self-end" key={i}>
                        <MdiIcon path={symbol.icon} className={css('inline content-end justify-self-end', symbol.color || 'text-blue-800')} size={symbol.size || '22px'} />
                    </div>
                ))
            }
        </>
    )
}

const applyHighlighting = (course: CourseMapping, query: string): HighlightedSearchComponents => {
    const name = course.name.toLowerCase();
    const catalogName = course.catalogName.toLowerCase();
    const queryLower = query.toLowerCase();

    // process the course name
    const nameQueryIndex = name.indexOf(queryLower);
    let nameStart = course.name, nameEnd = '', nameHighlighted = '';
    if (nameQueryIndex !== -1) {
        nameStart = course.name.slice(0, nameQueryIndex);
        nameEnd = course.name.slice(nameQueryIndex + query.length);
        nameHighlighted = course.name.slice(nameQueryIndex, nameQueryIndex + query.length);
    }

    // process the catalog name
    const catalogQueryIndex = catalogName.indexOf(queryLower);
    let catalogNameStart = course.catalogName, catalogNameEnd = '', catalogNameHighlighted = '';
    if (catalogQueryIndex !== -1) {
        catalogNameStart = course.catalogName.slice(0, catalogQueryIndex);
        catalogNameEnd = course.catalogName.slice(catalogQueryIndex + query.length);
        catalogNameHighlighted = course.catalogName.slice(catalogQueryIndex, catalogQueryIndex + query.length);
    }

    return {
        name: (
            <>
                {nameStart}
                <span className="text-orange-400">
                    {nameHighlighted}
                </span>
                {nameEnd}
            </>
        ),
        catalogName: (
            <>
                {catalogNameStart}
                <span className="text-orange-400">
                    {catalogNameHighlighted}
                </span>
                {catalogNameEnd}
            </>
        )
    }
}

export const CobaltSearch: React.FC = () => {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CourseMapping[]>([]);
    const [showResults, setShowResults] = useState(false);

    const debouncedQuery = useDebounce(query, 250);
    useClickBoundary(searchRef, () => setShowResults(false));

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        getSearchCompletions(debouncedQuery).then(setResults);
    }, [debouncedQuery]);

    useEffect(() => {
        if (results.length > 0)
            setShowResults(true);
    }, [results]);

    return (
        <Command
            shouldFilter={false}
            ref={searchRef}
            className={css('group max-w-[535px] w-full mx-auto mb-6 mt-10 shadow-md bg-white rounded-t-lg',
                showResults && 'rounded-b-none',
                !showResults && 'rounded-b-lg'
            )}
        >
            <CommandInput
                className="h-[50px] w-full border-none py-2 pr-4 pl-2 shadow-none leading-tight focus-visible:ring-0 caret-gray-700 text-gray-700"
                placeholder="Search for any course.."
                value={query}
                icon={
                    <div className="mr-2">
                        <MdiIcon path={mdiMagnify} size="21px" className="ml-1 text-gray-400" />
                    </div>
                }
                onClick={() => {
                    if (results.length > 0 && !showResults)
                        setShowResults(true);
                }}
                onValueChange={val => setQuery(val)}
            />

            <CommandList className={css('text-gray-700 no-scrollbar overflow-scroll block absolute rounded-b-lg rounded-t-none bg-white mt-[55px] w-[535px]', !showResults && 'hidden')}>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup>
                    {results.map((result, i) => {
                        let { name, catalogName } = applyHighlighting(result, query);

                        return (
                            <CommandItem
                                key={i}
                                value={result.name}
                                // keywords={[result.name, result.catalogName]}
                                onSelect={course => router.push(`/courses/${course}`)}
                                className="text-gray-700 py-2 aria-selected:bg-gray-300 aria-selected:text-gray-800 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="flex w-[100%]">
                                    <div className="flex-initial">
                                        {getIconForCourse(result.name, 'text-blue-700 mr-1.5 inline align-text-bottom', 18)}
                                        <span className="text-gray-800">{name}</span>{" "}
                                        <span className="text-gray-600">
                                            {/* {trimWithEllipsis(result.catalogName, 50)} */}
                                            {catalogName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-auto justify-end">
                                    {renderSymbols(result)}
                                </div>
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}