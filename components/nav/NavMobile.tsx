import { useState } from 'react';
import { Button } from '../ui/button';
import { mdiCodeBlockBraces, mdiCodeJson, mdiHeart, mdiMenu, mdiReact } from '@mdi/js';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { MdiIcon, SITE_LOGO, css } from '~/util';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { MobileRoutes } from '.';

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={css(className)}
            {...props}
        >
            {children}
        </Link>
    )
}

export const MobileNavigation: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <MdiIcon path={mdiMenu} size="24px" className="inline" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
                    <MdiIcon path={SITE_LOGO} size={1} className="h-7 w-7 mr-2" />
                    <span className="font-extrabold font-mono">
                        Cobalt
                    </span>
                </MobileLink>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-3">
                        {
                            MobileRoutes.map(({ title, routes }, i) => (
                                <div key={i} className="flex flex-col space-y-3 pt-6">
                                    <h4 className="font-medium">{title}</h4>
                                    {
                                        routes.map(({ name, key, path }) => (
                                            <MobileLink className="text-muted-foreground" key={key} href={path} onOpenChange={setOpen}>
                                                {name}
                                            </MobileLink>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-col pt-9 space-y-2 text-sm">
                        <span className="font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 from-15% via-blue-400 via-50% to-purple-400 to-90%">
                            ILEFA Labs <span className="text-gray-300 font-medium">&copy; 2020-{new Date().getFullYear()}</span>
                        </span> 

                        <span className="text-muted-foreground text-sm">
                            Made with <MdiIcon path={mdiHeart} size="13px" className="inline text-red-400" /> and lots of <MdiIcon path={mdiReact} size="13px" className="inline text-blue-500" />.
                        </span>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}