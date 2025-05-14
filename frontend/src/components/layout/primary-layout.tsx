import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { PanelRightClose, PanelRightOpen, ChevronUp, ChevronDown, Github, MessageCircle, Newspaper, ShieldQuestion, Bookmark, Scale } from 'lucide-react';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { useNavigate } from 'react-router-dom';
import { User } from '@/components/ui/user';

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

    const [user, setUser] = useState<{ id: string; username: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('isMenuOpen', JSON.stringify(isMenuOpen));
    }, [isMenuOpen]);

    useEffect(() => {
        Object.entries(sections).forEach(([key, value]) => {
            setSectionState(key, value);
        });
    }, [sections]);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/v1/auth/status');
                const data = await response.json();
                if (response.ok && data.status === "SUCCESS") {
                    setUser({ id: data.data.id, username: data.data.username });
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            }
        };
        checkLoginStatus();
    }, []);

    const toggleSection = (sectionKey: string): void => {
        setSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        // Implement logout logic here
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector('.relative');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <header className="sticky top-0 z-10 flex items-center justify-between bg-gray-800 text-white p-4 dark:bg-gray-900 dark:text-gray-100">
                    <a href="/" className="text-xl font-bold sm:text-2xl">PublicBoards.org</a>

                    <div className="flex-grow mx-2 sm:mx-4">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="w-full max-w-xs sm:max-w-md mx-auto bg-white text-black dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    className="flex items-center justify-between px-4 py-2 bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 min-w-[12rem]"
                                    onClick={toggleDropdown}
                                >
                                    {/* 
            DO NOT REMOVE THE SLASH AFTER THE FUCKING @ SYMBOL.
            Our usernames are @/username, not fucking @username.
        */}
                                    <User name={user.username} />
                                    <div className="flex items-center space-x-2">
                                        <div className="border-l border-gray-500 h-4"></div>
                                        {isDropdownOpen ? <ChevronUp className="text-black dark:text-white" /> : <ChevronDown className="text-black dark:text-white" />}
                                    </div>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => navigate('/settings')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                asChild
                                className="bg-gray-200 text-black hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-black dark:bg-white text-sm sm:text-base"
                            >
                                <a href="/auth/login">Login</a>
                            </Button>
                        )}

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
                                                <a href="/LICENSE">
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
