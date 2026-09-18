import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PencilIcon, Trash2 } from 'lucide-react';

interface ProjectHandleProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ProjectHandle = ({ onEdit, onDelete, isDeleting }: ProjectHandleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Open project handle" />}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-slate-300 rounded-md"
            onClick={() => {
              onEdit();
            }}
          >
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-slate-300 rounded-md"
            disabled={isDeleting}
            onClick={() => {
              onDelete();
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectHandle;
