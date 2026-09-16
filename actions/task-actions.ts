'use server';

import { db } from '@/db';
import { getOrCreateUser } from '@/lib/auth-service';
import { ActionResult } from '@/type';
import { projects, tasks, TaskSelect } from '@/db/schema';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { TaskInput, taskSchema } from '@/schemas/task-schema';
import { isUniqueViolation } from '@/lib/utils';

export const deleteTask = async (taskId: number): Promise<ActionResult<TaskSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }
  try {
    const [deletedTask] = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, taskId),
          inArray(
            tasks.projectId,
            db.select({ projectId: projects.id }).from(projects).where(eq(projects.userId, userId))
          )
        )
      )
      .returning();
    if (!deletedTask) {
      return {
        success: false,
        error: 'Failed to delete the task',
      };
    }
    revalidatePath(`/projects/${deletedTask.projectId}`);
    return {
      success: true,
      data: deletedTask,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};

export const createTask = async (
  projectId: number,
  task: TaskInput
): Promise<ActionResult<TaskSelect>> => {
  const result = taskSchema.safeParse(task);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }
  const values = result.data;
  try {
    const userId = await getOrCreateUser();
    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!existingProject) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        ...values,
        userId,
        projectId,
      })
      .returning();

    if (!newTask) {
      return {
        success: false,
        error: 'Failed to create the task',
      };
    }
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      data: newTask,
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['Name already exists'] },
      };
    }
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};

export const updateTask = async (
  taskId: number,
  data: TaskInput
): Promise<ActionResult<TaskSelect>> => {
  const result = taskSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  const values = result.data;

  try {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...values,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (!updatedTask) {
      return {
        success: false,
        error: 'Failed to update the task',
      };
    }
    return {
      success: true,
      data: updatedTask,
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['Name already exists'] },
      };
    }
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};

export const toggleTaskStatus = async (taskId: number): Promise<ActionResult<TaskSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  try {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (!task) {
      return {
        success: false,
        error: 'Task not found',
      };
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        status: task.status === 'completed' ? 'pending' : 'completed',
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (!updatedTask) {
      return {
        success: false,
        error: 'Failed to update the task',
      };
    }
    revalidatePath(`/projects/${updatedTask.projectId}`);
    return {
      success: true,
      data: updatedTask,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};
