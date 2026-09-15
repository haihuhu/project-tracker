import { TaskStatus, taskStatuses } from '@/lib/data';
import { z } from 'zod';

export const taskSchema = z.object({
  name: z.string().min(1, { message: 'Task name is required' }),
  description: z.string().default(''),
  status: z.enum(taskStatuses.map((item) => item.value) as [TaskStatus, ...TaskStatus[]]).default('pending'),
  dueDate: z.coerce.date().min(new Date(), { message: 'Due date must be in the future' }),
});

export type TaskInput = z.input<typeof taskSchema>;
export type TaskOutput = z.output<typeof taskSchema>;
