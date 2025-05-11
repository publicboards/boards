import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { PanelRightClose, PanelRightOpen, ChevronUp, ChevronDown, Github, MessageCircle, Newspaper, ShieldQuestion, Bookmark, Scale } from 'lucide-react';
import { ThemeProvider } from '@/components/layout/theme-provider';

const getSectionState = (sectionKey: string, defaultState: boolean): boolean => {
    const savedState = localStorage.getItem(sectionKey);
    return savedState ? JSON.parse(savedState) : defaultState;
};

const setSectionState = (sectionKey: string, state: boolean): void => {
    localStorage.setItem(sectionKey, JSON.stringify(state));
};

import type { ReactNode } from 'react';

type PrimaryLayoutProps = {
    children: ReactNode;
};

export function PrimaryLayout({ children }: PrimaryLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(() => {
        const savedState = localStorage.getItem('isMenuOpen');
        return savedState ? JSON.parse(savedState) : true;
    });

    const [sections, setSections] = useState<{ [key: string]: boolean }>(() => ({
        subscriptions: getSectionState('subscriptions', true),
        resources: getSectionState('resources', true),
    }));

    useEffect(() => {
        localStorage.setItem('isMenuOpen', JSON.stringify(isMenuOpen));
    }, [isMenuOpen]);

    useEffect(() => {
        Object.entries(sections).forEach(([key, value]) => {
            setSectionState(key, value);
        });
    }, [sections]);

    const toggleSection = (sectionKey: string): void => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <header className="sticky top-0 z-10 flex items-center justify-between bg-gray-800 text-white p-4 dark:bg-gray-900 dark:text-gray-100">
                    <a href="/" className="text-xl font-bold sm:text-2xl">PublicBoards.org</a>

                    <div className="flex-grow mx-2 sm:mx-4">
                        <Input type="text" placeholder="Search..." className="w-full max-w-xs sm:max-w-md mx-auto bg-white text-black dark:bg-gray-700 dark:text-gray-200" />
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Button asChild className="bg-gray-200 text-black hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-black dark:bg-white text-sm sm:text-base">
                            <a href="/auth/login">Login</a>
                        </Button>

                        <ModeToggle />
                    </div>
                </header>

                <div className="flex flex-grow h-[calc(100vh-64px)] overflow-hidden">
                    <aside className={`bg-gray-100 dark:bg-gray-800 p-2 sm:p-4 transition-all ${isMenuOpen ? 'w-48 sm:w-64' : 'w-4 sm:w-8'} relative overflow-y-auto`} style={{ height: 'calc(100vh - 64px)' }}>
                        {isMenuOpen && (
                            <div className="mt-2 sm:mt-4">
                                <div className="mb-2 sm:mb-4">
                                    <ul className="text-black dark:text-gray-200 text-sm sm:text-base">
                                        <li><a href="/" className="hover:underline">Front Page</a></li>
                                        <li className="relative flex items-center">
                                            <a href="/messages" className="hover:underline">Messages</a>
                                            <span className="ml-1 sm:ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 sm:px-2 py-0.5">
                                                3
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <h2 className="font-bold mb-1 sm:mb-2 text-black dark:text-gray-200 cursor-pointer flex items-center" onClick={() => toggleSection('subscriptions')}>
                                    Subscriptions
                                    {sections.subscriptions ? <ChevronUp className="ml-1 sm:ml-2" /> : <ChevronDown className="ml-1 sm:ml-2" />}
                                </h2>
                                {sections.subscriptions && (
                                    <>
                                        <ul className="mb-2 sm:mb-4 text-black dark:text-gray-200 text-xs sm:text-sm pl-2 sm:pl-4">
                                            <li><a href="/_/announcements">_/Announcements</a></li>
                                            <li><a href="/_/boards">_/Boards</a></li>
                                        </ul>
                                    </>
                                )}
                                <h2 className="font-bold mb-1 sm:mb-2 text-black dark:text-gray-200 cursor-pointer flex items-center" onClick={() => toggleSection('resources')}>
                                    Resources
                                    {sections.resources ? <ChevronUp className="ml-1 sm:ml-2" /> : <ChevronDown className="ml-1 sm:ml-2" />}
                                </h2>
                                {sections.resources && (
                                    <>
                                        <ul className="text-black dark:text-gray-200 text-xs sm:text-sm pl-2 sm:pl-4">
                                            <li><a href="https://github.com/samintheshell/boards" target="_blank">
                                                <Github className="inline mr-1 sm:mr-2" />
                                                GitHub
                                            </a></li>
                                            <li><a href="/contact">
                                                <MessageCircle className="inline mr-1 sm:mr-2" />
                                                Contact Us
                                            </a></li>
                                            <li><a href="/about">
                                                <Newspaper className="inline mr-1 sm:mr-2" />
                                                About Us
                                            </a></li>
                                            <li>
                                                <hr className="my-2 border-gray-300 dark:border-gray-700 w-3/4" />
                                            </li>
                                            <li><a href="/privacy">
                                                <ShieldQuestion className="inline mr-1 sm:mr-2" />
                                                Privacy Policy
                                            </a></li>
                                            <li><a href="/terms">
                                                <Bookmark className="inline mr-1 sm:mr-2" />
                                                Terms of Service
                                            </a></li>
                                            <li>
                                                <a href="/license">
                                                    <Scale className="inline mr-1 sm:mr-2" />
                                                    AGPL3 License
                                                </a>
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </aside>

                    <main className="flex-grow p-2 sm:p-4 text-black dark:text-gray-200 overflow-y-auto">
                        {children}
                    </main>
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="fixed bottom-4 left-4 text-black dark:text-gray-200 p-1 sm:p-2 group"
                    style={{ zIndex: 20 }}
                >
                    {isMenuOpen ? <PanelRightOpen /> : <PanelRightClose />}
                    <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {isMenuOpen ? 'Collapse Menu' : 'Expand Menu'}
                    </span>
                </button>
            </div>
        </ThemeProvider>
    );
}
