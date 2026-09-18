'use server';

import { db } from '@/db';
import { projects, ProjectSelect } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';
import { isUniqueViolation } from '@/lib/utils';
import { ProjectInput, projectSchema } from '@/schemas/project-schema';
import { ActionResult } from '@/type/index';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const createProject = async (formDate: ProjectInput): Promise<ActionResult<ProjectSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized to create a project. Please login to continue.',
    };
  }

  const res = projectSchema.safeParse(formDate);
  if (!res.success) {
    return {
      success: false,
      fieldErrors: res.error.flatten().fieldErrors,
    };
  }

  const validatedData = res.data;

  try {
    const newProject = await db
      .insert(projects)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        categoryId: Number(validatedData.categoryId),
        budget: validatedData.budget.toString(),
        userId: userId,
      })
      .returning();
    if (![newProject][0]) {
      return {
        success: false,
        error: 'db create project failed. Please try again.',
      };
    }
    const project = newProject[0];
    revalidatePath('/projects');
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['This project name already exists.'] },
      };
    }
  }

  return {
    success: false,
    error: 'Something went wrong. Please try again.',
  };
};

export const deleteProject = async (projectId: number): Promise<ActionResult<ProjectSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized to delete a project. Please login to continue.',
    };
  }

  try {
    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    if (!deletedProject) {
      return {
        success: false,
        error: 'Project not found. Please try again.',
      };
    }
    revalidatePath('/projects');
    return {
      success: true,
      data: deletedProject,
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        error: 'Project is associated with tasks. Please delete all tasks first.',
      };
    }
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
};

export const updateProject = async (
  projectId: number,
  formData: ProjectInput
): Promise<ActionResult<ProjectSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized to update a project. Please login to continue.',
    };
  }

  const res = projectSchema.safeParse(formData);
  if (!res.success) {
    return {
      success: false,
      fieldErrors: res.error.flatten().fieldErrors,
    };
  }

  const validatedData = res.data;

  try {
    const [updatedProject] = await db
      .update(projects)
      .set({
        name: validatedData.name,
        description: validatedData.description,
        categoryId: Number(validatedData.categoryId),
        budget: validatedData.budget.toString(),
      })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();
    if (!updatedProject) {
      return {
        success: false,
        error: 'Project not found. Please try again.',
      };
    }
    revalidatePath('/projects');
    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['This project name already exists.'] },
      };
    }
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
};
