import { TaskStatus, taskStatuses } from '@/lib/data';
import { relations, sql } from 'drizzle-orm';

import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  nameSnapshot: text('name_short').notNull().default(''),
  emailSnapshot: text('email_short').notNull().default(''),
  imageSnapshot: text('image_short').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('category_user_id_name_unique').on(table.userId, table.name)]
);

export type CategoryInsert = typeof categories.$inferInsert;
export type CategorySelect = typeof categories.$inferSelect;

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    budget: numeric('budget', { precision: 10, scale: 2 }).notNull().default('0.00'),
    description: text('description').notNull().default(''),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('project_user_id_name_unique').on(table.userId, table.name)]
);

export type ProjectInsert = typeof projects.$inferInsert;
export type ProjectSelect = typeof projects.$inferSelect;

export const tasks = pgTable(
  'tasks',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    projectId: integer('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull().default(''),
    status: varchar('status', {
      enum: taskStatuses.map((item) => item.value) as [TaskStatus, ...TaskStatus[]],
    })
      .notNull()
      .default('pending'),
    dueDate: timestamp('due_date')
      .notNull()
      .default(sql`now() + interval '10 day'`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('task_user_id_project_id_name_unique').on(
      table.userId,
      table.projectId,
      table.name
    ),
  ]
);

export type TaskInsert = typeof tasks.$inferInsert;
export type TaskSelect = typeof tasks.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  projects: many(projects),
  tasks: many(tasks),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  category: one(categories, { fields: [projects.categoryId], references: [categories.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}));
