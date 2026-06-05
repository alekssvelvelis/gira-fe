import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex-grow transition-all duration-300 ease-in-out overflow-auto p-4">
        {children}
      </main>
    </div>
  );
}
