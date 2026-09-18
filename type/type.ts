import { CategorySelect, ProjectSelect } from '@/db/schema';

export interface SidebarProps {
  categoriesWithProjects: (CategorySelect & { projects: ProjectSelect[] })[];
  unCategorizedProjects: ProjectSelect[];
  setOpen?: () => void;
}

export interface ProjectProps {
  id: number;
  name: string;
  categoryId: number | null;
  description: string;
  budget: number;
}
