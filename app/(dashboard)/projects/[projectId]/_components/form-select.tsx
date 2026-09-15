import { deleteCategory } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfirm } from '@/hooks/use-confirm';
import { Pencil, Trash } from 'lucide-react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: readonly { value: string; label: string; projectCount?: number }[];
  placeholder: string;
  onEditCategory?: (category: { id: number; categoryName: string }) => void;
}

export const FormSelect = <T extends FieldValues>({
  control,
  name,
  options,
  placeholder,
  onEditCategory,
}: FormSelectProps<T>) => {
  const [ConfirmationDialog, confirm] = useConfirm(
    'Delete Category',
    'This action will delete the category and all projects belonging to it.'
  );
  const handleDelete = async (value: string, projectCount: number) => {
    const confirmed = await confirm({
      title: `Delete Category ${value}`,
      message: `This action will delete the category and all projects belonging to it.
     There is ${projectCount} projects belonging to this category.`,
    });
    if (confirmed) {
      try {
        const result = await deleteCategory(Number(value));
        if (!result.success) {
          toast.error(`Failed to delete category`);
          return;
        }

        toast.success(`Category ${result.data?.name} deleted successfully`);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find((item) => item.value === field.value);
          return (
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <SelectTrigger className="w-full flex-1">
                <SelectValue placeholder={placeholder}>
                  <p className="text-sm font-medium"> {selectedOption?.label ?? placeholder}</p>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map(({ value, label, projectCount }) => {
                    return (
                      <SelectItem key={value} value={value} className="flex justify-between">
                        <div className="flex items-center gap-5">
                          <p className="text-sm font-medium"> {label}</p>
                          <span className="text-xs text-gray-500">
                            {projectCount && projectCount > 0 ? (
                              <span className="text-xs text-gray-500">
                                ({projectCount} project
                                {projectCount && projectCount > 1 ? 's' : ''} belong to this category)
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">(No projects belong to this category)</span>
                            )}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(value, projectCount ?? 0)}>
                          <Trash className="size-4 text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation(); // stop to select on click of edit button
                            onEditCategory?.({
                              id: parseInt(value),
                              categoryName: label,
                            });
                          }}
                        >
                          <Pencil className="size-4 text-blue-500" />
                        </Button>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      ></Controller>
    </>
  );
};
