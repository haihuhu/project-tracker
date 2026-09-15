import { db } from '@/db';
import { categories, projects, tasks, users } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';

import { count, eq } from 'drizzle-orm';

export const getCurrentUserWithRelations = async () => {
  const userId = await getOrCreateUser();

  const [projectCount, taskCount] = await Promise.all([
    //get the number of the current user's projects
    db
      .select({ totalProjects: count() })
      .from(projects)
      .where(eq(projects.userId, Number(userId))),

    //get the number of the current user's tasks
    db
      .select({ totalTasks: count() })
      .from(tasks)
      .where(eq(tasks.userId, Number(userId))),
  ]);

  return {
    projectCount: [projectCount[0].totalProjects],
    taskCount: [taskCount[0].totalTasks],
  };
};

//get the user's categories and their projects to display in the sidebar navigation
export const getUserCategoriesWithProjects = async () => {
  const userId = await getOrCreateUser();

  const categoriesWithProjects = await db.query.categories.findMany({
    where: eq(categories.userId, Number(userId)),
    with: {
      projects: true,
    },
  });

  return categoriesWithProjects;
};
