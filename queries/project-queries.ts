import { db } from '@/db';
import { projects } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const getProjectById = async (projectId: number) => {
  const userId = await getOrCreateUser();
  if (!userId) return redirect('/login');

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, Number(userId))),
    with: {
      tasks: {
        orderBy: (tasks, { asc }) => [asc(tasks.name)],
      },
    },
  });
  if (!project?.id) return null;
  return project;
};
