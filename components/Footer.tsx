import { MdiWrapper } from '~/util';
import { buttonVariants } from './ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export const Footer: React.FC = () => (
    <footer className="md:px-8 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 m:6-24 md:flex-row">
            <div className="font-mono text-center text-muted-background md:text-left">
                <a href="https://www.ilefa.club" className="font-bold text-white">
                    ILEFA Labs
                </a>{" "} &copy; 2020-{new Date().getFullYear()}
                <br />
                <span className="text-[0.8rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-100 from-15% via-blue-300 via-50% to-purple-300 to-90%">
                    Cobalt{" "}
                    {/* <MdiWrapper path="mdiRocketLaunch" size={0.7} color="currentColor" className="inline" />{" "} */}
                    (6.0, no_commit_id, dev)
                </span>
                <br />
                <span className="text-[0.8rem] text-red-600 font-bold">
                    For internal use only - do not distribute or transmit.
                </span>
            </div>
            <div className="flex gap-4">
                <a
                    href="https://github.com/ilefa"
                    rel="noopener noreferrer"
                    target="_blank"
                    className={buttonVariants({ variant: 'ghost' })}
                >
                    <GitHubLogoIcon className="h-6 w-6" />
                </a>
            </div>
        </div>
    </footer>
);