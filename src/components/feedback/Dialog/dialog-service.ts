type ConfirmationDialogRequest = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type ConfirmationDialogController = {
  present: (request: ConfirmationDialogRequest) => Promise<boolean>;
};

let confirmationDialogController: ConfirmationDialogController | null = null;

export function registerConfirmationDialogController(controller: ConfirmationDialogController) {
  confirmationDialogController = controller;

  return () => {
    if (confirmationDialogController === controller) {
      confirmationDialogController = null;
    }
  };
}

export async function showConfirmationDialog(request: ConfirmationDialogRequest) {
  if (!confirmationDialogController) {
    return false;
  }

  return confirmationDialogController.present(request);
}
