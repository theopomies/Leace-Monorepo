import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../shared/button/Button";

export interface DeleteProfileDialogProps {
  onDelete: () => void;
}

export function DeleteProfileDialog({ onDelete }: DeleteProfileDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button theme="danger">Delete my account</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 bg-gray-500 opacity-70" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[70vh] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-white p-8">
          <Dialog.Title asChild>
            <h1 className="p-4 text-xl">Delete my account</h1>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="p-4 text-lg">
              Are you sure you want to delete your account?
            </p>
          </Dialog.Description>
          <div className="flex justify-end gap-4 pt-4">
            <Dialog.Close asChild>
              <Button theme="white">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button theme="danger" onClick={() => onDelete()}>
                Yes, delete my account
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
