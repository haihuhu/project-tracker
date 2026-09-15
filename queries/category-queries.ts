import { db } from '@/db';
import { categories, projects } from '@/db/schema';
import { getOrCreateUser } from '@/lib/auth-service';
import { and, count, eq } from 'drizzle-orm';

export const getCategories = async () => {
  const userId = await getOrCreateUser();

  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized to get categories. Please login to continue.',
    };
  }

  try {
    const categoriesResult = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        projectCount: count(projects.id),
      })
      .from(categories)
      .where(eq(categories.userId, userId))
      .leftJoin(projects, and(eq(categories.id, projects.categoryId), eq(projects.userId, userId)))
      .groupBy(categories.id);

    return {
      success: true,
      data: categoriesResult,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to get categories. Please try again.',
    };
  }
};
