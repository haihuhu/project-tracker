'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskSelect } from '@/db/schema';
import { TaskStatus, taskStatuses } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Pencil, Trash } from 'lucide-react';

interface TaskCardProps {
  task: TaskSelect;
  deletingTaskId: number | null;
  onEdit: (task: TaskSelect) => void;
  onDelete: (task: TaskSelect) => void;
  onToggleTask: (taskId: number) => void;
}

const statusStyles: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const statusLabels = Object.fromEntries(
  taskStatuses.map((option) => [option.value, option.label])
) as Record<TaskStatus, string>;

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const TaskCard = ({
  task,
  deletingTaskId,
  onEdit,
  onDelete,
  onToggleTask,
}: TaskCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="leading-snug">{task.name}</CardTitle>
          <span
            className={cn(
              'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer',
              statusStyles[task.status as TaskStatus] ?? 'bg-gray-100 text-gray-800'
            )}
            onClick={() => onToggleTask(task.id)}
          >
            {statusLabels[task.status as TaskStatus] ?? task.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {task.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description</p>
        )}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Due</span>
          <span className="font-medium text-foreground">{formatDate(task.dueDate)}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(task)}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={deletingTaskId === task.id}
          onClick={() => onDelete(task)}
        >
          <Trash className="size-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
