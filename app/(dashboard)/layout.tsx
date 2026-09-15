import Sidebar from '@/components/sidebar';
import { getUserCategoriesWithProjects } from '@/queries/user-queries';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const categoriesWithProjects = await getUserCategoriesWithProjects();
  return (
    <>
      <div className="flex">
        <aside className="sticky top-14 z-40 hidden shrink-0 self-start sm:block">
          <Sidebar categoriesWithProjects={categoriesWithProjects} />
        </aside>
        <div className="min-h-[calc(100vh-3.5rem)] flex-1 border-l border-slate-100 px-4 sm:px-6 lg:px-8 mt-3">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
