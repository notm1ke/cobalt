import Tagline from '~/components/Tagline';
import { CobaltSearch } from '~/components/CobaltSearch';

const HomePage = () => {
    return (
        <div className="container relative">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 mt-7 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
                <h1 className="font-mono text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] mb-3 text-transparent bg-clip-text bg-gradient-to-br from-indigo-100 from-15% via-blue-300 via-50% to-purple-300 to-90%">
                    Cobalt
                </h1>
                <p className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
                    An intelligent suite of tools built by UConn students, for UConn students.
                </p>
                <CobaltSearch />
                <Tagline />
            </section>
        </div>
    );
}

export default HomePage;