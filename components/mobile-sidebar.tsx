'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SidebarProps } from '@/type/type';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './sidebar';

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
            setOpen={() => setOpen(false)}
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
