"use client";

import Link from 'next/link';

import { Routes } from '.';
import { MdiIcon, SITE_LOGO, css } from '~/util';

import {
    ListItem,
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '../ui/navigation-menu';

export const Navigation: React.FC = () => {
    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="text-lg mr-6 flex items-center space-x-2">
                <MdiIcon path={SITE_LOGO} size={1} className="h-7 w-7" />
                <span className="hidden font-extrabold font-mono sm:inline-block">
                    Cobalt
                </span>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    {
                        Routes.map(route => {
                            if (route.dropdown) return (
                                <NavigationMenuItem key={route.key}>
                                    <NavigationMenuTrigger className="font-mono font-bold">
                                        {route.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {
                                                route.dropdown.map(({ name, key, description, path, icon, newTab }) => (
                                                    <ListItem
                                                        key={key}
                                                        title={name}
                                                        icon={icon}
                                                        href={path}
                                                        {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
                                                    >
                                                        {description}
                                                    </ListItem>
                                                ))
                                            }
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );

                            return (
                                <NavigationMenuItem key={route.key}>
                                    <Link href={route.path} legacyBehavior passHref>
                                        <NavigationMenuLink className={css('font-mono', navigationMenuTriggerStyle())}>
                                            {route.name}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )
                        })
                    }
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}