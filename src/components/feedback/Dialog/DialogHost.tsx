import { useEffect, useMemo, useState } from 'react';

import { registerConfirmationDialogController } from './dialog-service';
import { Dialog } from './Dialog';

type PendingDialogState = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  resolve: (confirmed: boolean) => void;
} | null;

export function DialogHost() {
  const [pendingDialog, setPendingDialog] = useState<PendingDialogState>(null);

  const controller = useMemo(
    () => ({
      present: (request: {
        title: string;
        description?: string;
        confirmLabel?: string;
        cancelLabel?: string;
      }) =>
        new Promise<boolean>((resolve) => {
          setPendingDialog({
            ...request,
            resolve,
          });
        }),
    }),
    [],
  );

  useEffect(() => {
    return registerConfirmationDialogController(controller);
  }, [controller]);

  return (
    <Dialog
      visible={Boolean(pendingDialog)}
      variant="confirm"
      title={pendingDialog?.title || ''}
      description={pendingDialog?.description}
      confirmLabel={pendingDialog?.confirmLabel || 'Confirm'}
      cancelLabel={pendingDialog?.cancelLabel || 'Cancel'}
      onConfirm={() => {
        if (!pendingDialog) {
          return;
        }

        pendingDialog.resolve(true);
        setPendingDialog(null);
      }}
      onCancel={() => {
        if (!pendingDialog) {
          return;
        }

        pendingDialog.resolve(false);
        setPendingDialog(null);
      }}
    />
  );
}
