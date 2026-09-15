import z from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required' }),
  description: z.string().min(1, { message: 'Project description is required' }),
  categoryId: z.coerce.number().int().positive({ message: 'Invalid category id' }),
  budget: z.coerce.number().min(0, { message: 'Budget must be greater than 0' }),
});

export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectOutput = z.output<typeof projectSchema>;
