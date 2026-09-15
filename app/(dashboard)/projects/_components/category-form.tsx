'use client';

import { createCategory, updateCategory } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';
import { CategoryInput, categorySchema } from '@/schemas/category-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProjectFormField } from './project-form-field';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  onClose: () => void;
  initialData?: { id: number; categoryName: string } | null;
  onSuccess: () => void;
}

const CategoryForm = ({ onClose, initialData, onSuccess }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.categoryName });
    } else {
      reset({ name: '' });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CategoryInput) => {
    try {
      const result = editingCategory ? await updateCategory(Number(initialData?.id), data) : await createCategory(data);
      if (!result.success) {
        const fieldErrors = result.fieldErrors;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([key, messages]) => {
            if (messages?.length) {
              setError(key as keyof CategoryInput, { message: messages[0] });
            }
          });
        }

        return;
      }
      onSuccess();
      const categoryName = result.data?.name;
      toast.success(
        editingCategory ? `Category ${categoryName} updated successfully` : `Category ${categoryName} created successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };
  const editingCategory = initialData ? true : false;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <ProjectFormField label="Name" errorMessage={errors.name?.message}>
          <Input
            type="text"
            {...register('name')}

            placeholder="Enter category name"
            className="w-full"
          />
        </ProjectFormField>
        <SheetFooter>
          <Button type="submit" disabled={isSubmitting}>
            {editingCategory ? 'Update Category' : 'Create Category'}{' '}
            {isSubmitting && <Loader2 className="size-4 animate-spin ml-2" />}
          </Button>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </SheetFooter>
      </form>
    </>
  );
};
export default CategoryForm;
