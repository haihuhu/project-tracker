import { Label } from '@/components/ui/label';

export const ProjectFormField = ({
  children,
  label,
  errorMessage,
}: {
  children: React.ReactNode;
  label: string;
  errorMessage?: string;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row gap-2">
        <Label className="w-24"> {label} </Label>
        <div className="flex-1 w-full ">{children}</div>
      </div>
      {errorMessage && <p className="text-sm text-center text-red-500">{errorMessage}</p>}
    </div>
  );
};
