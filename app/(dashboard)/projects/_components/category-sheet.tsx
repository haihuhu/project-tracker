import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import CategoryForm from './category-form';

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: { id: number; categoryName: string } | null;
}
const CategorySheet = ({ open, onOpenChange, onSuccess, initialData }: CategorySheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-2">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {initialData ? 'Edit Category' : 'Add Category'}
          </SheetTitle>
          <SheetDescription>
            {initialData
              ? 'Edit the category to update its name.'
              : 'Create a new category to organize your projects.'}
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onClose={() => onOpenChange(false)}
          initialData={initialData}
          onSuccess={onSuccess}
        />
      </SheetContent>
    </Sheet>
  );
};
export default CategorySheet;
