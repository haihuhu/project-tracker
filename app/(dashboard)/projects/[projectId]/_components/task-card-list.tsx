'use client';

import { TaskSelect } from '@/db/schema';
import { TaskCard } from './task-card';

interface TaskCardListProps {
  tasks: TaskSelect[];
  deletingTaskId: number | null;
  onEdit: (task: TaskSelect) => void;
  onDelete: (task: TaskSelect) => void;
}

export const TaskCardList = ({ tasks, deletingTaskId, onEdit, onDelete }: TaskCardListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No tasks yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          deletingTaskId={deletingTaskId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskCardList;
