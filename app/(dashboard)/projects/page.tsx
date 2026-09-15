import { getCurrentUserWithRelations } from '@/queries/user-queries';

import { redirect } from 'next/navigation';
import ProjectCreateButton from './_components/project-create-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const ProjectsPage = async () => {
  const user = await getCurrentUserWithRelations();

  if (!user) {
    redirect('/');
  }
  return (
    <>
      {/* create a new project button */}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-gray-500"> {user.projectCount} projects</p>
            <p className="text-sm text-gray-500"> {user.taskCount} tasks</p>
          </div>
          <Link href="/projects/new-project">
            <Button className="cursor-pointer" variant="outline" size="sm">
              <PlusIcon className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* display each project's name and progress bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" items-center justify-between">
            <h1 className="text-2xl font-bold">Projects</h1>

            <p className="text-sm text-gray-500">{user.projectCount} projects</p>
            <p className="text-sm text-gray-500">{user.taskCount} tasks</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectsPage;
