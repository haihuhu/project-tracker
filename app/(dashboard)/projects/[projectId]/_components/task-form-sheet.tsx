import { createTask, updateTask } from '@/actions/task-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { TaskSelect } from '@/db/schema';
import { taskStatuses } from '@/lib/data';
import { TaskInput, taskSchema } from '@/schemas/task-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TaskFormField } from './task-form-field';
import { useParams } from 'next/navigation';
interface TaskFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: TaskSelect | null;
}

const TaskFormSheet = ({ open, onOpenChange, onSuccess, initialData }: TaskFormSheetProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = parseInt(projectId as string);
  const {
    register,
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: initialData?.status || 'pending',
      dueDate: initialData?.dueDate || new Date(),
    },
  });
  const onSubmit = async (data: TaskInput) => {
    try {
      const result = initialData
        ? await updateTask(initialData.id, data)
        : await createTask(projectIdNumber, data);
      if (!result.success) {
        const fieldErrors = result.fieldErrors;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([key, messages]) => {
            if (messages && messages.length > 0) {
              setError(key as keyof TaskInput, { message: messages[0] });
            }
          });
        }
        toast.error(initialData ? 'Failed to update task' : 'Failed to create task');
        return;
      }
      onSuccess?.();
      toast.success(initialData ? 'Task updated successfully' : 'Task created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {initialData ? 'Edit Task' : 'Create Task'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {initialData
              ? 'Edit the task details here. Click save when you&apos;re done.'
              : 'Create a new task by filling in the details below.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* name */}
          <TaskFormField label="Name:" errorMessage={errors.name?.message}>
            <Input {...register('name')} />
          </TaskFormField>
          {/* description */}
          <TaskFormField label="Description:" errorMessage={errors.description?.message}>
            <Textarea {...register('description')} />
          </TaskFormField>
          {/* status */}
          <TaskFormField label="Status:" errorMessage={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => {
                return (
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskStatuses.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </TaskFormField>
          {/* due date */}
          <TaskFormField label="Due Date:" errorMessage={errors.dueDate?.message}>
            <Input type="date" {...register('dueDate')} />
          </TaskFormField>

          {/* actions */}
          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>
            <SheetClose
              render={
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              }
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskFormSheet;
