'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskSelect } from '@/db/schema';
import { TaskStatus, taskStatuses } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface TaskTableProps {
  tasks: TaskSelect[];
  deletingTaskId: number | null;
  onEdit: (task: TaskSelect) => void;
  onDelete: (task: TaskSelect) => void;
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

export const TaskTable = ({ tasks, onEdit, onDelete, deletingTaskId }: TaskTableProps) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No tasks yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium align-top">{task.name}</td>
                <td className="px-4 py-3 align-top text-muted-foreground max-w-[320px]">
                  <span className="line-clamp-2 block">{task.description || '—'}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      statusStyles[task.status as TaskStatus] ?? 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {statusLabels[task.status as TaskStatus] ?? task.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground whitespace-nowrap">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Open actions for ${task.name}`}
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(task)}
                        disabled={deletingTaskId === task.id}
                      >
                        <Trash className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
