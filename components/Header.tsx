"use client";

import { Navigation } from './nav/Nav';
import { NavSearch } from './nav/NavSearch';
import { MobileNavigation } from './nav/NavMobile';

export const Header: React.FC = () => (
    <header className="top-3 z-40 w-full">
      <div className="container mt-3 flex h-16 items-center space-x-4">
            <Navigation />
            <MobileNavigation />
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                    <NavSearch />
                </div>
            </div>
        </div>
    </header>
)