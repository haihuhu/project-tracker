'use client';

import { ChevronDown, FolderKanban, Layers3 } from 'lucide-react';
import { useState } from 'react';

import { SidebarProps } from '@/type/type';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const SidebarCategories = ({ categoriesWithProjects }: SidebarProps) => {
  const [openCategories, setOpenCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  };

  const router = useRouter();

  return (
    <section className="flex h-full flex-col" aria-label="Project categories ">
      <div className="mb-4 flex items-center justify-between px-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Layers3 className="size-4 text-indigo-500" />
            Categories
          </h2>
        </div>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
          {categoriesWithProjects.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {categoriesWithProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-4 text-center text-xs leading-5 text-slate-400">
            暂无分类
          </div>
        ) : (
          categoriesWithProjects.map((category) => {
            const isOpen = openCategories.includes(category.id);

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-transparent transition-colors hover:border-slate-200 hover:bg-slate-50"
              >
                <div
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                    <FolderKanban className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                    {category.name}
                  </span>
                  <button
                    type="button"
                    aria-label={`${isOpen ? '收起' : '展开'} ${category.name}`}
                    aria-expanded={isOpen}

                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-white/70 px-3 pb-2.5 pt-1.5">
                    {category.projects.length === 0 ? (
                      <p className="px-9 py-1 text-xs text-slate-400">暂无项目</p>
                    ) : (
                      <div className="space-y-0.5">
                        {category.projects.map((project) => (
                          <Button
                            key={project.id}
                            variant="ghost"
                            className="truncate rounded-lg py-1.5 pl-9 pr-2 text-xs text-slate-500 transition cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => router.push(`/projects/${project.id}`)}
                          >
                            <p className="text-left  text-sm overflow-hidden">{project.name}</p>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default SidebarCategories;
