'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProjectCreateButton = () => {
  const router = useRouter();
  const handleClick = () => {
    console.log('clicked');

    router.push('/projects/new-project');
  };
  return (
    <Button className="mt-5 cursor-pointer" variant="outline" size="sm" onClick={handleClick}>
      <PlusIcon className="w-4 h-4" />
      New Project
    </Button>
  );
};

export default ProjectCreateButton;
