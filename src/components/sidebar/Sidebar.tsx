import { useState } from 'react';

import ThemeToggle from "@/components/sidebar/ThemeToggle";

import { GoSidebarExpand } from "react-icons/go";
import { IoCogOutline } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

import { SIDEBAR_SECTIONS } from '@/constants/sidebar-sections';

export const Sidebar = () => {

    const [sidebarShown, setSidebarShown] = useState<boolean>(true);
    const toggleSidebar = () => {
        setSidebarShown(!sidebarShown);
    }

    return (
        <nav className={`min-h-screen bg-accent w-48 flex flex-col transition-transform duration-300 ${sidebarShown ? 'translate-x-0' : '-translate-x-38'}`}>
            <div className='w-full max-h-16 bg-accent flex flex-row items-center align-between'>
                <div className='w-1/2 mx-2'>
                    <h1 className='text-2xl font-light uppercase'>Gira</h1>
                </div>
                <div className="flex justify-end w-1/2">
                    <ThemeToggle />
                    <button
                        onClick={() => toggleSidebar()}
                        aria-label={`Sidebar open / close button`}
                        className='
                        m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer'
                    >
                        <GoSidebarExpand className={`
                            w-6 h-6 transition-transform duration-300 
                            ${sidebarShown ? 'rotate-0' : 'rotate-180'}`
                        }/>
                    </button>
                </div>
            </div>

            <div className='flex-1'>
            {SIDEBAR_SECTIONS.map(section => (
                <div
                    key={section.title}
                    className='w-full min-h-8 bg-accent flex flex-col'
                >
                    <h1 className='mx-2 uppercase font-light'>{section.title}</h1>
                    {section.items.map(item => (
                        <a className='w-full max-h-16 flex flex-row items-center duration-300 transition-all
                            hover:cursor-pointer hover:bg-secondary' 
                            id={item.label} 
                            href={item.href}
                        >
                            <div className='w-1/2 mx-2'>
                                <h1 className='text-xl font-light'>{item.label}</h1>
                            </div>
                            <div className='flex justify-end w-1/2'>
                                {item.icon}
                            </div>
                        </a>
                    ))}
                    {/* <div className='w-full h-[1px] bg-secondary'></div> */}
                    <hr />
                </div>
            ))}
            </div>

            <div className='w-full h-10 flex items-center justify-between px-2 duration-300 transition-all hover:cursor-pointer hover:bg-secondary'>
                <h1 className='text-xl font-light'>Alekss Velvelis</h1>
                <IoCogOutline className='h-6 w-6 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />
            </div>
            <hr/>
            <div className='pb-1 w-full h-10 flex items-center justify-between px-2 duration-300 transition-all hover:cursor-pointer hover:bg-secondary'>
                <h1 className='text-xl font-light'>Logout</h1>
                <SlLogout className='h-6 w-6 transition-all duration-300 hover:scale-110 hover:cursor-pointer pr-1' />
            </div>
        </nav>
    )
}