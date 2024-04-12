'use client';

import { useLocalStorage } from '@uidotdev/usehooks';

import {
    Dispatch,
    createContext,
    useCallback,
    useReducer
} from 'react';

const INITIAL_STATE = Array<string>();

const FavoritesContext = createContext<FavoritesContextType>([]);
const FavoritesDispatchContext = createContext<Dispatch<FavoritesAction>>({} as any);

type FavoritesContextType = string[];
export type FavoritesAction = {
    type: FavoritesActionType;
    payload: string;
}

type FavoritesActionType = 'add' | 'remove' | 'toggle';

export const DiningFavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {    
    const [favorites, dispatch] = useFavorites();

    return (
        <FavoritesContext.Provider value={favorites}>
            <FavoritesDispatchContext.Provider value={dispatch}>
                {children}
            </FavoritesDispatchContext.Provider>
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const [state, save] = useLocalStorage('favorites', INITIAL_STATE);

    const reducerLocalStorage = useCallback((state: any, action: FavoritesAction) => {
        const newState = favoritesReducer(state, action);
        save(newState);
        return newState;
    }, [save]);

    return useReducer(reducerLocalStorage, state);
}

const favoritesReducer = (state: FavoritesContextType, action: FavoritesAction) => {
    switch (action.type) {
        case 'add':
            let added = [...state, action.payload!];
            return added;
        case 'remove':
            let removed = state.filter(favorite => favorite !== action.payload!);
            return removed;
        case 'toggle': 
            let toggled = state.includes(action.payload!)
                ? state.filter(favorite => favorite !== action.payload!)
                : [...state, action.payload!];
            return toggled;
        default:
            throw new Error('Unknown Action:', action.type);
    }
}