import { useState } from 'react';

import ThemeToggle from "@/components/sidebar/ThemeToggle";

import { GoSidebarExpand } from "react-icons/go";
import { IoCogOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

import { SIDEBAR_SECTIONS } from '@/constants/sidebar-sections';

import { useAuth } from '@/hooks/useAuth';

export const Sidebar = () => {

    const [sidebarShown, setSidebarShown] = useState<boolean>(false);
    const { logout } = useAuth();

    const MOBILE_BREAKPOINT = 768; // Tailwind md in px

    const width = window.innerWidth;
    const isMobile = width < MOBILE_BREAKPOINT;
    return (
        <>
        {isMobile && sidebarShown && (
            <div
                className="fixed inset-0 bg-black/40 z-10 transition-opacity duration-300"
                onClick={() => setSidebarShown(false)}
            />
        )}
            <nav 
                className={`
                    h-screen flex-shrink-0 bg-accent flex flex-col overflow-hidden
                    transition-all duration-300
                    ${isMobile
                        ? `fixed z-20 w-48 ${sidebarShown ? 'translate-x-0' : '-translate-x-38'}`
                        : `sticky top-0 ${sidebarShown ? 'w-48' : 'w-10'}`
                    }
                `}
            >
                {/* width in tailwind is calculated as w-{number * 0.25rem}, therefore w-48 = 12rem and w-10 = 2.5rem. REM is the default, so use rem for calculations */}
                <div className={`w-48 flex flex-col flex-1 transition-all duration-300 ${
                    !isMobile && !sidebarShown ? '-translate-x-[calc(12rem-2.5rem)]' : 'translate-x-0'
                }`}
                >
                    <div className='w-full max-h-16 bg-accent flex flex-row items-center'>
                        <div className='w-1/2 mx-2'>
                            <h1 className='text-2xl font-light uppercase'>Gira</h1>
                        </div>
                        <div className="flex justify-end w-1/2">
                            <ThemeToggle />
                            <button
                                onClick={() => setSidebarShown(!sidebarShown)}
                                aria-label="Sidebar open / close button"
                                className='m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer'
                            >
                                <GoSidebarExpand className={`w-6 h-6 transition-transform duration-300 ${sidebarShown ? 'rotate-0' : 'rotate-180'}`} />
                            </button>
                        </div>
                    </div>

                    <div className='flex-1'>
                        {SIDEBAR_SECTIONS.map(section => (
                            <div key={section.title} className='w-full min-h-8 bg-accent flex flex-col'>
                                <h1 className='mx-2 uppercase font-light'>{section.title}</h1>
                                {section.items.map(item => (
                                    <a
                                        key={item.label}
                                        className='w-full max-h-16 flex flex-row text-sidebar-text items-center duration-300 transition-all hover:cursor-pointer hover:bg-secondary'
                                        id={item.label}
                                        href={item.href}
                                    >
                                        <div className='flex-1 mx-2'>
                                            <h1 className='text-xl font-light'>{item.label}</h1>
                                        </div>
                                        <div className='w-10 flex justify-center flex-shrink-0'>
                                            {item.icon}
                                        </div>
                                    </a>
                                ))}
                                <hr />
                            </div>
                        ))}
                    </div>

                    <div className='w-full h-10 flex items-center justify-between px-2 duration-300 transition-all hover:cursor-pointer hover:bg-secondary'>
                        <h1 className='text-xl font-light'>Alekss Velvelis</h1>
                        <IoCogOutline className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </div>
                    <hr />
                    <div 
                    onClick={() => logout()}
                    className='pb-1 w-full h-10 flex items-center justify-between px-2 duration-300 transition-all hover:cursor-pointer hover:bg-secondary'
                    >
                        <h1 className='text-xl font-light'>Logout</h1>
                        <SlLogout className='h-6 w-6 flex-shrink-0 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
                    </div>

                </div>
            </nav>
            {isMobile && (
                <div className="w-10 flex-shrink-0 h-screen" />
            )}
        </>
    )
}