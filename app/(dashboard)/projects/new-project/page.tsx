import ProjectForm from '../_components/project-form';
import { getCategories } from '@/queries/category-queries';

const NewProjectPage = async () => {
  const categoriesResult = await getCategories();

  return (
    <div>
      {/*Project form */}
      <ProjectForm categories={categoriesResult.data || []} />
    </div>
  );
};

export default NewProjectPage;
