import { Sidebar } from '@/components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export function SidebarLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex-grow transition-all duration-300 ease-in-out overflow-auto p-4">
        <Outlet/>
      </main>
    </div>
  );
}
