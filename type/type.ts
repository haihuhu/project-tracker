import { CategorySelect, ProjectSelect } from '@/db/schema';

export interface SidebarProps {
  categoriesWithProjects: (CategorySelect & { projects: ProjectSelect[] })[];
}
