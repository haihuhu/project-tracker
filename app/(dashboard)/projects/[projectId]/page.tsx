import { getProjectById } from '@/queries/project-queries';
import Link from 'next/link';
import TaskWorkspace from './_components/task-workspace';

const ProjectPage = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  const projectWithTasks = await getProjectById(Number(projectId));

  return (
    <>
      <div>
        {/* back to the projects page */}
        {/* <Link href="/projects">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer">
            Back to Projects
          </button>
        </Link> */}

        <p className="text-left text-sm">{projectWithTasks?.name ?? 'No project found'}</p>

        <div>
          <TaskWorkspace tasks={projectWithTasks?.tasks ?? []} />
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
