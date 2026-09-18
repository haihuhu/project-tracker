'use client';

import { useConfirm } from '@/hooks/use-confirm';
import type { ProjectProps } from '@/type/type';
import { useState } from 'react';
import ProjectHandle from './project-handle';

import { deleteProject } from '@/actions/project-actions';
import ProjectForm from '@/app/(dashboard)/projects/_components/project-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CategoryOption {
  categoryId: number;
  categoryName: string;
  projectCount: number;
}
interface ProjectActionsProps {
  project: ProjectProps;
  categories: CategoryOption[];
}

const ProjectActions = ({ project, categories }: ProjectActionsProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectProps | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Project',
    'Are you sure you want to delete this project?'
  );

  const handleEditProject = () => {
    setEditingProject(project);
    setIsOpen(true);
  };

  const handleUpdateProjectSuccess = () => {
    setIsOpen(false);
    setEditingProject(null);
    router.refresh();
  };

  // delete function
  const handleDeleteProject = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    setDeletingProjectId(project.id);

    try {
      const result = await deleteProject(project.id);
      if (!result.success) {
        toast.error('Failed to delete project');
        return;
      }
      router.push('/projects');
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const isDeleting = deletingProjectId === project.id;

  return (
    <>
      <div>
        {/* confirm dialog */}
        <ConfirmDialog />
        {/* project handle */}
        <ProjectHandle onEdit={handleEditProject} onDelete={handleDeleteProject} isDeleting={isDeleting} />

        {/* edit project dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Make changes to your project here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm initialData={editingProject} categories={categories} onSuccess={handleUpdateProjectSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProjectActions;
