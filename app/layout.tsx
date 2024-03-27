import { css } from '~/util';
import type { Metadata } from 'next';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Open_Sans, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '~/components/ui/theme-provider';

import "~/styles/globals.css";

const sans = Open_Sans({ subsets: ["latin"], variable: '--font-sans' });
const mono = Roboto_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
    title: {
        default: "Cobalt",
        template: `Cobalt - %s`,
    },
    description: "An intelligent suite of tools built by UConn students, for UConn students.",
    // themeColor: [
    //     { media: "(prefers-color-scheme: light)", color: "white" },
    //     { media: "(prefers-color-scheme: dark)", color: "black" },
    // ],
    icons: {
        icon: "/favicon.ico",
        // shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={css("min-h-screen bg-pattern font-sans antialiased", sans.variable, mono.variable)}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
