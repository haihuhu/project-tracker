'use client';

import { createProject, updateProject } from '@/actions/project-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectInput, projectSchema } from '@/schemas/project-schema';
import { ProjectProps } from '@/type/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CategorySheet from './category-sheet';
import { FormSelect } from './form-select';
import { ProjectFormField } from './project-form-field';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

interface CategoryOption {
  categoryId: number;
  categoryName: string;
  projectCount: number;
}

interface ProjectFormProps {
  categories: CategoryOption[];
  initialData?: ProjectProps | null;
  onSuccess?: () => void;
}

const ProjectForm = ({ categories, initialData, onSuccess }: ProjectFormProps) => {
  const [categorySheetOpen, setCategorySheetOpen] = useState(false); //add category modal state
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    categoryName: string;
  } | null>(null); //edit category modal state
  const router = useRouter();
  const handleAddCategory = () => {
    setCategorySheetOpen(true);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: { id: number; categoryName: string }) => {
    setCategorySheetOpen(true);
    setEditingCategory(category);
  };

  const handleCategorySuccess = () => {
    setCategorySheetOpen(false);
    setEditingCategory(null);
    router.refresh();
  };

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData ?? {
      name: '',
      description: '',
      categoryId: '',
      budget: '',
    },
  });

  const onSubmit = async (data: ProjectInput) => {
    try {
      const response = initialData ? await updateProject(initialData.id, data) : await createProject(data);
      if (!response.success) {
        const fieldErrors = response.fieldErrors;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([key, messages]) => {
            if (messages?.length) setError(key as keyof ProjectInput, { message: messages[0] });
          });
        }
        toast.error(response.error);
        return;
      }

      toast.success(initialData ? 'Project updated successfully' : 'Project created successfully');
      if (initialData) {
        onSuccess?.();
      } else {
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error(initialData ? 'Failed to update project' : 'Failed to create project');
    }
  };

  return (
    <div>
      <CategorySheet
        open={categorySheetOpen}
        onOpenChange={(open) => setCategorySheetOpen(open)}
        initialData={editingCategory ?? undefined}
        onSuccess={() => handleCategorySuccess()}
      />
      <div>
        <h1 className="text-2xl font-bold"> Create a new project </h1>
        <p className="text-sm text-gray-500"> Fill in the details below to create a new project </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-4">
        {/* project name */}
        <ProjectFormField label=" Name: *" errorMessage={errors.name?.message}>
          <Input type="text" {...register('name')} />
        </ProjectFormField>
        {/* project category ,the add category button  */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="w-full">
            <ProjectFormField label="Category:" errorMessage={errors.categoryId?.message}>
              <FormSelect
                control={control}
                name="categoryId"
                options={categories.map((category) => ({
                  label: category.categoryName,
                  value: category.categoryId.toString(),
                  projectCount: category.projectCount,
                }))}
                placeholder="Select category"
                onEditCategory={(category) => handleEditCategory(category)}
                initialData={initialData?.categoryId}
              />
            </ProjectFormField>
          </div>
          <Button type="button" variant="outline" onClick={() => handleAddCategory()}>
            Add New Category
          </Button>
        </div>

        {/* project description */}
        <ProjectFormField label=" Description: *" errorMessage={errors.description?.message}>
          <Textarea {...register('description')} rows={4} />
        </ProjectFormField>

        {/* project budget */}
        <ProjectFormField label="Budget: *" errorMessage={errors.budget?.message}>
          <Input type="number" {...register('budget')} />
        </ProjectFormField>

        {/* the submit button and the reset button in the project form */}
        <>
          {initialData ? (
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Project'}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
                Reset
              </Button>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
            </DialogFooter>
          ) : (
            <div className="flex justify-center items-center mt-4 gap-2">
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
                Reset
              </Button>
            </div>
          )}
        </>
      </form>
    </div>
  );
};

export default ProjectForm;
