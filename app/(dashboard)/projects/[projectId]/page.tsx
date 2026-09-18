import ProjectActions from '@/components/project-actions';
import { getCategories } from '@/queries/category-queries';
import { getProjectById } from '@/queries/project-queries';
import TaskWorkspace from './_components/task-workspace';
import { ProjectProps } from '@/type/type';

const ProjectPage = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  const projectWithTasks = await getProjectById(Number(projectId));
  const categoriesResult = await getCategories();

  const categories = categoriesResult.data ?? [];

  if (!projectWithTasks) {
    return <div>Project not found</div>;
  }

  const project: ProjectProps = {
    id: projectWithTasks.id,
    name: projectWithTasks.name,
    categoryId: projectWithTasks.categoryId,
    description: projectWithTasks.description,
    budget: Number(projectWithTasks.budget),
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-left text-sm">{project.name}</p>
          {/* Project handle used to edit and delete project */}
          <ProjectActions key={project.id} project={project} categories={categories} />
        </div>

        <div>
          <TaskWorkspace tasks={projectWithTasks.tasks} />
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
