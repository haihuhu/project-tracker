import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ConfirmOptions = {
  title?: string;
  message?: string;
};

export const useConfirm = (
  defaultTitle: string,
  defaultMessage: string,
) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const [dialogContent, setDialogContent] = useState({
    title: defaultTitle,
    message: defaultMessage,
  });

  const pendingResolveRef = useRef<((value: boolean) => void) | null>(
    null,
  );

  const confirm = (options?: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      if (pendingResolveRef.current) {
        pendingResolveRef.current(false);
      }

      setDialogContent({
        title: options?.title ?? defaultTitle,
        message: options?.message ?? defaultMessage,
      });

      pendingResolveRef.current = resolve;
      setPromise({ resolve });
    });

  const handleClose = () => {
    pendingResolveRef.current?.(false);
    pendingResolveRef.current = null;
    setPromise(null);
  };

  const handleConfirm = () => {
    pendingResolveRef.current?.(true);
    pendingResolveRef.current = null;
    setPromise(null);
  };

  const handleCancel = () => {
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="default">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm] as const;
};
