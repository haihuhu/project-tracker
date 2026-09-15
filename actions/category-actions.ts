'use server';

import { db } from '@/db';
import { categories, CategorySelect } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';
import { isUniqueViolation } from '@/lib/utils';
import { CategoryInput, categorySchema } from '@/schemas/category-schema';
import { ActionResult } from '@/type';
import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const createCategory = async (data: CategoryInput): Promise<ActionResult<CategorySelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  const res = categorySchema.safeParse(data);
  if (!res.success) {
    const fieldErrors = res.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors,
    };
  }
  const validatedData = res.data;

  try {
    const newCategory = await db
      .insert(categories)
      .values({
        ...validatedData,
        userId,
      })
      .returning();

    if (!newCategory[0]) {
      return {
        success: false,
        error: 'Failed to create category',
      };
    }
    revalidatePath('/projects/new-project');
    return {
      success: true,
      data: newCategory[0],
    };
  } catch (error) {
    console.error(error);

    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['Category name must be unique'] },
      };
    }
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};

export const updateCategory = async (id: number, data: CategoryInput): Promise<ActionResult<CategorySelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }
  const res = categorySchema.safeParse(data);
  if (!res.success) {
    const fieldErrors = res.error.flatten().fieldErrors;
    return {
      success: false,
      fieldErrors,
    };
  }
  const validatedData = res.data;

  try {
    const existingCategory = await db.query.categories.findFirst({
      where: and(eq(categories.userId, userId), eq(categories.name, validatedData.name), ne(categories.id, id)),
    });
    if (existingCategory) {
      return {
        success: false,
        fieldErrors: { name: ['Category name already exists'] },
      };
    }

    const updatedCategory = await db
      .update(categories)
      .set({ name: validatedData.name })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    if (!updatedCategory[0]) {
      return {
        success: false,
        error: 'Failed to update category',
      };
    }
    revalidatePath('/projects/new-project');
    return {
      success: true,
      data: updatedCategory[0],
    };
  } catch (error) {
    console.error(error);
    if (isUniqueViolation(error)) {
      return {
        success: false,
        fieldErrors: { name: ['Category name must be unique'] },
      };
    }
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};

export const deleteCategory = async (id: number): Promise<ActionResult<CategorySelect>> => {
  const userId = await getOrCreateUser();
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  try {
    const deletedCategory = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    if (!deletedCategory[0]) {
      return {
        success: false,
        error: 'failed to delete category',
      };
    }

    revalidatePath('/projects/new-project');
    return {
      success: true,
      data: deletedCategory[0],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};
