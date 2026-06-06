import { LuLayoutDashboard, LuCalendarDays, LuFolder, LuClipboardList } from "react-icons/lu";
import { GoPeople } from "react-icons/go";

interface SidebarItem{
    label: string,
    icon: React.ReactNode,
    href?: string
};

interface SidebarSectionInterface {
    title: string,
    items: SidebarItem[]
};

export const SIDEBAR_SECTIONS: SidebarSectionInterface[] = [
    {
        title: 'Main',
        items: [
            { label: 'Dashboard', icon: <LuLayoutDashboard className='h-6 w-6 m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer'/>, href: '/dashboard'},
            { label: 'Calendar', icon: <LuCalendarDays className='h-6 w-6 m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />, href: '/calendar'},
        ],
    },
    {
        title: 'Management',
        items: [
            { label: 'Organizations', icon: <LuClipboardList className='h-6 w-6 m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer'/>, href: '/organizations'},
        ],
    },
    {
        title: 'Self',
        items: [
            { label: 'Organizations', icon: <LuClipboardList className='h-6 w-6 m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer'/>, href: '/create/organization'},
            // { label: 'Tasks', icon: <LuClipboardList className='h-6 w-6 m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer' />},
        ],
    },
];