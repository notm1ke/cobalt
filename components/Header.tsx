"use client";

import { Navigation } from './Nav';
import { NavSearch } from './NavSearch';

export const Header: React.FC = () => (
    <header className="top-3 z-40 w-full">
      <div className="container mt-3 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <Navigation />
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                    <NavSearch />
                </div>
            </div>
        </div>
    </header>
)