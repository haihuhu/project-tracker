import Sidebar from '@/components/sidebar';
import { getUserCategoriesWithProjects } from '@/queries/user-queries';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { categories, unCategorizedProjects } = await getUserCategoriesWithProjects();

  return (
    <>
      <div className="flex">
        <aside className="hidden sm:block sticky top-14 z-40 shrink-0 self-start ">
          <Sidebar categoriesWithProjects={categories} unCategorizedProjects={unCategorizedProjects} />
        </aside>
        <div className="min-h-[calc(100vh-3.5rem)] flex-1 sm:border-l border-slate-100 px-1 sm:px-6 lg:px-8 mt-3">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
