import z from 'zod';

export const categorySchema = z
  .object({
    name: z.string().min(1, { message: 'Category name is required' }),
  })
  .refine((data) => data.name.trim().length > 0, { message: 'Category name cannot be empty' });

export type CategoryInput = z.input<typeof categorySchema>;
export type CategoryOutput = z.output<typeof categorySchema>;
