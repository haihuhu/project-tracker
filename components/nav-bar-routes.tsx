'use client';

import { navRoutes } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const NavBarRoutes = () => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    return pathname === href;
  };
  return (
    <div className="flex w-6xl mx-auto items-center gap-2">
      {navRoutes.map((route) => (
        <Link key={route.href} href={route.href}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer',
              isActive(route.href) && 'text-blue-500'
            )}
          >
            {route.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default NavBarRoutes;
