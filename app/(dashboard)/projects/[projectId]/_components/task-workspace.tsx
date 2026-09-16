'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TaskSelect } from '@/db/schema';
import { useConfirm } from '@/hooks/use-confirm';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { deleteTask, toggleTaskStatus } from '@/actions/task-actions';
import { TaskCardList } from './task-card-list';
import TaskFormSheet from './task-form-sheet';
import { TaskTable } from './task-table';

interface TaskWorkspaceProps {
  tasks: TaskSelect[];
}

export const TaskWorkspace = ({ tasks }: TaskWorkspaceProps) => {
  //set editing task state and set sheet open state
  const [editingTask, setEditingTask] = useState<TaskSelect | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  //set deleting task id state
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const [ConfirmationDialog, confirm] = useConfirm(
    'Delete Task',
    'This action will permanently delete the task. This cannot be undone.'
  );

  const openCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEdit = (task: TaskSelect) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  //handle delete task by id
  const handleDelete = async (task: TaskSelect) => {
    const confirmed = await confirm({
      title: `Delete "${task.name}"?`,
    });
    if (!confirmed) return;
    setDeletingTaskId(task.id);
    try {
      const result = await deleteTask(task.id);
      if (!result.success) {
        toast.error('Failed to delete the task');
        return;
      }
      const deletedTask = result.data;
      if (!deletedTask) {
        toast.error('Failed to delete the task');
        return;
      }
      toast.success(`Task "${deletedTask.name}" deleted successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const result = await toggleTaskStatus(taskId);
      if (!result.success) {
        toast.error('Failed to goggle the task status');
        return;
      }
      const updatedTask = result.data;
      if (!updatedTask) {
        toast.error('Failed to toggle the task status');
        return;
      }
      toast.success(`Task "${updatedTask.name}" status toggled successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const formKey = editingTask ? `edit-${editingTask.id}` : 'create';

  return (
    <div className="flex flex-col gap-4">
      {/*  */}
      {ConfirmationDialog()}
      {/* Header / actions row */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-xs text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <Button type="button" size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>

      {/* Responsive views */}
      <div className="hidden md:block">
        <TaskTable
          tasks={tasks}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingTaskId={deletingTaskId}
          onToggleTask={handleToggleTask}
        />
      </div>
      <div className="block md:hidden">
        <TaskCardList
          tasks={tasks}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingTaskId={deletingTaskId}
          onToggleTask={handleToggleTask}
        />
      </div>

      <TaskFormSheet
        key={formKey}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTask}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default TaskWorkspace;
