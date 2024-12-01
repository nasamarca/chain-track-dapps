import Image from 'next/image'
import React, { useState } from 'react'
import logoDark from '../public/ChainTrack-Dark.svg'
import logoLight from '../public/ChainTrack-Light.svg'
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { ConnectKitButton } from "connectkit";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const isActiveLink = (path) => {
        return pathname === path;
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Users', path: '/users' },
    ];

    return (
        <nav className="bg-white mx-auto dark:bg-black shadow-md w-full fixed top-0 left-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image
                                src={theme === 'dark' ? logoDark : logoLight}
                                alt="ChainTrack Logo"
                                width={150}
                                height={40}
                                className="cursor-pointer transition-opacity duration-200"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`${
                                    isActiveLink(link.path)
                                        ? 'text-orange-500 dark:text-orange-400 font-semibold'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
                                } transition-colors duration-200 text-sm`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <HiOutlineSun className="h-5 w-5 text-gray-300" />
                            ) : (
                                <HiOutlineMoon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        <ConnectKitButton />
                    </div>

                    <div className="md:hidden flex items-center space-x-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'dark' ? (
                                <HiOutlineSun className="h-5 w-5 text-gray-300" />
                            ) : (
                                <HiOutlineMoon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {isOpen ? (
                                <HiOutlineX className="h-6 w-6" />
                            ) : (
                                <HiOutlineMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black shadow-lg">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`${
                                    isActiveLink(link.path)
                                        ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-500 dark:hover:text-orange-400'
                                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center space-x-4 px-3 py-2">
                            <ConnectKitButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Nav;