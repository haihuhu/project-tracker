'use server';

import { db } from '@/db';
import { projects, ProjectSelect } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';
import { isUniqueViolation } from '@/lib/utils';
import { ProjectInput, projectSchema } from '@/schemas/project-schema';
import { ActionResult } from '@/type/index';
import { revalidatePath } from 'next/cache';

export const createProject = async (
  formDate: ProjectInput
): Promise<ActionResult<ProjectSelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized to create a project. Please login to continue.',
    };
  }

  const res = await projectSchema.safeParse(formDate);
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
        fieldErrors: { name: ['This project name is already taken.'] },
      };
    }
  }

  return {
    success: false,
    error: 'Something went wrong. Please try again.',
  };
};
