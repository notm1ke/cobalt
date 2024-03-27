'use server';

import { isGradLevel } from '~/util';
import { ContentArea, CourseMapping, getMappings } from '@ilefa/husky';

const MAX_SEARCH_RESULTS = 500;

export type SearchModifiers = 'ca1' | 'ca2' | 'ca3' | 'ca4' | 'ca4int' | 'lab' | 'w' | 'q' | 'e' | 'g' | 'ug';

const processModifiers = (modifiers: SearchModifiers[], data: CourseMapping[]) => {
    let copy = [...data];

    if (hasModifier(modifiers, 'ca1'))
        copy = copy.filter(ent => hasContentArea(ent, ContentArea.CA1))

    if (hasModifier(modifiers, 'ca2'))
        copy = copy.filter(ent => hasContentArea(ent, ContentArea.CA2))

    if (hasModifier(modifiers, 'ca3'))
        copy = copy.filter(ent => hasContentArea(ent, ContentArea.CA3))

    if (hasModifier(modifiers, 'ca4'))
        copy = copy.filter(ent => hasContentArea(ent, ContentArea.CA4))

    if (hasModifier(modifiers, 'ca4int'))
        copy = copy.filter(ent => hasContentArea(ent, ContentArea.CA4INT))

    if (hasModifier(modifiers, 'lab'))
        copy = copy.filter(ent => ent.attributes.lab)

    if (hasModifier(modifiers, 'w'))
        copy = copy.filter(ent => ent.attributes.writing)

    if (hasModifier(modifiers, 'q'))
        copy = copy.filter(ent => ent.attributes.quantitative)

    if (hasModifier(modifiers, 'e'))
        copy = copy.filter(ent => ent.attributes.environmental);

    if (hasModifier(modifiers, 'g'))
        copy = copy.filter(ent => isGradLevel(ent.name.split(/\d/)[0], ent.catalogNumber));

    if (hasModifier(modifiers, 'ug'))
        copy = copy.filter(ent => !isGradLevel(ent.name.split(/\d/)[0], ent.catalogNumber));

    return copy;
}

const hasModifier = (modifiers: SearchModifiers[], target: SearchModifiers) => modifiers.some(modifier => modifier === target);

const isValidModifier = (input: string): input is SearchModifiers => {
    let lower = input.toLowerCase();
    return lower === 'ca1'
        || lower === 'ca2'
        || lower === 'ca3'
        || lower === 'ca4'
        || lower === 'ca4int'
        || lower === 'lab'
        || lower === 'w'
        || lower === 'q'
        || lower === 'e'
        || lower === 'g'
        || lower === 'ug';
}

const hasContentArea = (course: CourseMapping, target: ContentArea) =>
    course
        .attributes
        .contentAreas
        .some((area: string) => area === target);

export const getSearchCompletions = async (query: string) => {
    const predicates: ((input: string, course: CourseMapping) => boolean)[] = [
        (input, { name, catalogName }) => name.toLowerCase().slice(0, input.length) === input.toLowerCase()
            || catalogName.toLowerCase().slice(0, input.length) === input.toLowerCase(),
        (input, { name, catalogName }) => name.toLowerCase().includes(input)
            || catalogName.toLowerCase().includes(input)
    ];

    let modifiers = query
        .split(' ')
        .filter(input => input.startsWith('+'))
        .map(token => token.substring(1))
        .filter(isValidModifier);

    let result = getMappings()
        .filter(course => predicates.some(predicate =>
            predicate(query
                .split(' ')
                .filter(token => !token.startsWith('+'))
                .join(' '), course)))
        .filter((course, index, self) => index === self.findIndex(c => c.name === course.name && c.catalogNumber === course.catalogNumber))
        .sort((a, b) => {
            let aStart = a.name.toLowerCase().slice(0, query.length) === query.toLowerCase();
            let bStart = b.name.toLowerCase().slice(0, query.length) === query.toLowerCase();
            if (aStart && bStart)
                return a.name.localeCompare(b.name);

            if (aStart && !bStart)
                return -1;

            if (bStart && !aStart)
                return 1;

            return a.name.localeCompare(b.name);
        })        
        
    result = processModifiers(modifiers, result);
    result = result.slice(0, Math.min(result.length, MAX_SEARCH_RESULTS));

    return result;
}