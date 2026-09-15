import { inArray } from 'drizzle-orm';

import { db } from '@/db';
import {
  categories,
  CategoryInsert,
  projects,
  ProjectInsert,
  tasks,
  TaskInsert,
  users,
} from '@/db/schema';
import { TaskStatus, taskStatuses } from '@/lib/data';

const TARGET_USER_IDS = [1, 2] as const;

const ACTIVE_CATEGORY_MIN = 3;
const ACTIVE_CATEGORY_MAX = 5;

const EMPTY_CATEGORY_MIN = 1;
const EMPTY_CATEGORY_MAX = 2;

const PROJECT_MIN_PER_CATEGORY = 5;
const PROJECT_MAX_PER_CATEGORY = 10;

const EMPTY_PROJECT_MIN = 1;
const EMPTY_PROJECT_MAX = 2;

const TASK_MIN_PER_PROJECT = 5;
const TASK_MAX_PER_PROJECT = 10;

const TASK_BATCH_SIZE = 100;

const categoryNamePool = [
  'Electronics',
  'Furniture',
  'Accessories',
  'Office',
  'Marketing',
  'Development',
  'Testing',
  'Deployment',
  'Security',
  'Performance',
  'Design',
  'Documentation',
  'Training',
  'Consulting',
  'Planning',
  'Strategy',
  'Reporting',
  'Integration',
  'Migration',
  'Optimization',
  'Automation',
  'Monitoring',
];

const projectNamePool = [
  'Management System',
  'Customer Portal',
  'Analytics Dashboard',
  'Inventory Platform',
  'Marketing Website',
  'Payment Integration',
  'Internal Workspace',
  'Booking Application',
  'Reporting Tool',
  'Support Service',
];

const taskNamePool = [
  'Define project requirements',
  'Design database schema',
  'Create responsive layout',
  'Build reusable components',
  'Implement authentication',
  'Add form validation',
  'Create server action',
  'Implement error handling',
  'Add loading state',
  'Write unit tests',
  'Review accessibility',
  'Optimize performance',
  'Prepare deployment',
  'Write project documentation',
  'Test user permissions',
  'Handle empty state',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]!;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createFutureDate(): Date {
  const daysFromNow = randomInt(1, 30);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return new Date(Date.now() + daysFromNow * millisecondsPerDay);
}

function createTaskStatus(): TaskStatus {
  return randomItem(taskStatuses).value as TaskStatus;
}

function createCategoryName(baseName: string, userId: number, categoryIndex: number): string {
  return `${baseName} ${userId}-${categoryIndex + 1}`;
}

function createProjectName(categoryName: string, projectIndex: number): string {
  const projectType = randomItem(projectNamePool);

  return `${categoryName} ${projectType} #${projectIndex + 1}`;
}

function createTaskName(projectName: string, taskIndex: number): string {
  const taskType = randomItem(taskNamePool);

  return `${taskType} - ${projectName} #${taskIndex + 1}`;
}

function createProjectDescription(projectName: string): string {
  return `A sample project for ${projectName.toLowerCase()}.`;
}

function createTaskDescription(taskName: string): string {
  return `Complete the following task: ${taskName.toLowerCase()}.`;
}

async function seed() {
  console.log('Starting seed...');
  console.time('Seed completed in');

  await db.transaction(async (tx) => {
    console.log('Checking target users...');

    const existingUsers = await tx
      .select({
        id: users.id,
        clerkId: users.clerkId,
      })
      .from(users)
      .where(inArray(users.id, [...TARGET_USER_IDS]));

    const existingUserIds = new Set(existingUsers.map((user) => user.id));

    for (const userId of TARGET_USER_IDS) {
      if (!existingUserIds.has(userId)) {
        throw new Error(`User with id ${userId} does not exist.`);
      }
    }

    /*
     * Delete only the business data of target users.
     * Users themselves will not be deleted.
     */
    console.log('Clearing existing business data...');

    await tx.delete(tasks).where(inArray(tasks.userId, [...TARGET_USER_IDS]));

    await tx.delete(projects).where(inArray(projects.userId, [...TARGET_USER_IDS]));

    await tx.delete(categories).where(inArray(categories.userId, [...TARGET_USER_IDS]));

    let totalCategoryCount = 0;
    let totalProjectCount = 0;
    let totalTaskCount = 0;

    for (const userId of TARGET_USER_IDS) {
      console.log(`\nGenerating data for user ${userId}...`);

      const activeCategoryCount = randomInt(ACTIVE_CATEGORY_MIN, ACTIVE_CATEGORY_MAX);

      const emptyCategoryCount = randomInt(EMPTY_CATEGORY_MIN, EMPTY_CATEGORY_MAX);

      const selectedCategoryNames = shuffle(categoryNamePool).slice(
        0,
        activeCategoryCount + emptyCategoryCount
      );

      const activeCategoryNames = selectedCategoryNames.slice(0, activeCategoryCount);

      const emptyCategoryNames = selectedCategoryNames.slice(activeCategoryCount);

      /*
       * Create active categories.
       * These categories will contain projects.
       */
      const activeCategories: (typeof categories.$inferSelect)[] = [];

      for (let categoryIndex = 0; categoryIndex < activeCategoryNames.length; categoryIndex += 1) {
        const categoryName = createCategoryName(
          activeCategoryNames[categoryIndex]!,
          userId,
          categoryIndex
        );

        const categoryValues: CategoryInsert = {
          userId,
          name: categoryName,
        };

        const insertedCategories = await tx.insert(categories).values(categoryValues).returning();

        const insertedCategory = insertedCategories[0];

        if (!insertedCategory) {
          throw new Error(`Failed to insert category: ${categoryName}`);
        }

        activeCategories.push(insertedCategory);
        totalCategoryCount += 1;
      }

      /*
       * Create empty categories.
       * These categories intentionally contain no projects.
       */
      for (let categoryIndex = 0; categoryIndex < emptyCategoryNames.length; categoryIndex += 1) {
        const categoryName = createCategoryName(
          emptyCategoryNames[categoryIndex]!,
          userId,
          activeCategoryNames.length + categoryIndex
        );

        const categoryValues: CategoryInsert = {
          userId,
          name: categoryName,
        };

        await tx.insert(categories).values(categoryValues);

        totalCategoryCount += 1;
      }

      /*
       * Create projects under active categories.
       */
      const allProjects: (typeof projects.$inferSelect)[] = [];

      for (const category of activeCategories) {
        const projectCount = randomInt(PROJECT_MIN_PER_CATEGORY, PROJECT_MAX_PER_CATEGORY);

        for (let projectIndex = 0; projectIndex < projectCount; projectIndex += 1) {
          const projectName = createProjectName(category.name, projectIndex);

          const projectValues: ProjectInsert = {
            userId,
            categoryId: category.id,
            name: projectName,
            budget: randomInt(500, 15000).toFixed(2),
            description: createProjectDescription(projectName),
          };

          const insertedProjects = await tx.insert(projects).values(projectValues).returning();

          const insertedProject = insertedProjects[0];

          if (!insertedProject) {
            throw new Error(`Failed to insert project: ${projectName}`);
          }

          allProjects.push(insertedProject);
          totalProjectCount += 1;
        }
      }

      /*
       * Randomly select projects that should remain empty.
       * Empty projects will contain no tasks.
       */
      const emptyProjectCount = Math.min(
        randomInt(EMPTY_PROJECT_MIN, EMPTY_PROJECT_MAX),
        allProjects.length
      );

      const emptyProjects = new Set(
        shuffle(allProjects)
          .slice(0, emptyProjectCount)
          .map((project) => project.id)
      );

      /*
       * Prepare tasks for non-empty projects.
       */
      const allTasks: TaskInsert[] = [];

      for (const project of allProjects) {
        if (emptyProjects.has(project.id)) {
          continue;
        }

        const taskCount = randomInt(TASK_MIN_PER_PROJECT, TASK_MAX_PER_PROJECT);

        for (let taskIndex = 0; taskIndex < taskCount; taskIndex += 1) {
          const taskName = createTaskName(project.name, taskIndex);

          const taskValues: TaskInsert = {
            userId,
            projectId: project.id,
            name: taskName,
            description: createTaskDescription(taskName),
            status: createTaskStatus(),
            dueDate: createFutureDate(),
          };

          allTasks.push(taskValues);
        }
      }

      /*
       * Insert tasks in batches.
       */
      for (let batchStart = 0; batchStart < allTasks.length; batchStart += TASK_BATCH_SIZE) {
        const batch = allTasks.slice(batchStart, batchStart + TASK_BATCH_SIZE);

        await tx.insert(tasks).values(batch);
      }

      totalTaskCount += allTasks.length;

      console.log(
        `User ${userId}: ` +
          `${activeCategories.length + emptyCategoryNames.length} categories, ` +
          `${allProjects.length} projects, ` +
          `${allTasks.length} tasks`
      );

      console.log(`User ${userId} empty projects: ${emptyProjectCount}`);

      console.log(`User ${userId} empty categories: ${emptyCategoryCount}`);
    }

    console.log('\n=== Seed Summary ===');
    console.log(`Users:      ${TARGET_USER_IDS.length}`);
    console.log(`Categories: ${totalCategoryCount}`);
    console.log(`Projects:   ${totalProjectCount}`);
    console.log(`Tasks:      ${totalTaskCount}`);
    console.log(
      `Total:      ${
        TARGET_USER_IDS.length + totalCategoryCount + totalProjectCount + totalTaskCount
      }`
    );
  });

  console.timeEnd('Seed completed in');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
