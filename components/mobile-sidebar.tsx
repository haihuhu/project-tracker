'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './sidebar';
import { ProjectSelect } from '@/db/schema';
import { SidebarProps } from '@/type/type';

const MobileSidebar = ({ categoriesWithProjects, unCategorizedProjects }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="sm:hidden p-2 mr-2" variant="outline" onClick={() => setOpen(true)}>
        <MenuIcon className="w-4 h-4" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <Sidebar
            categoriesWithProjects={categoriesWithProjects}
            unCategorizedProjects={unCategorizedProjects}
            
          />
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
