'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

import { SidebarProps } from '@/type/type';
import SidebarCategories from './sidebar-categories';
import { Button } from './ui/button';

const Sidebar = ({ categoriesWithProjects, unCategorizedProjects }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`relative h-[calc(100vh-3.5rem)] border-r border-slate-200/80 bg-white/95 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-6'
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        aria-label={isOpen ? '收起侧边栏' : '展开侧边栏'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className=" absolute -right-3 top-5 z-10 flex size-6 items-center justify-center rounded-full border
         border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 
         hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        {isOpen ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
      </Button>

      <div className={`h-full overflow-hidden p-4 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <SidebarCategories
          categoriesWithProjects={categoriesWithProjects}
          unCategorizedProjects={unCategorizedProjects}
        />
      </div>
    </div>
  );
};

export default Sidebar;
