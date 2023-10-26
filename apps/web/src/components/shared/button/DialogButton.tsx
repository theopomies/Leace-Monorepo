import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./Button";

export interface DialogButtonProps {
  buttonText: string;
  title: string;
  description: string;
  confirmButtonText: string;
  onDelete: () => Promise<void>;
}

export function DialogButton({
  buttonText,
  title,
  description,
  confirmButtonText,
  onDelete,
}: DialogButtonProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button theme="danger">{buttonText}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=" fixed inset-0 bg-gray-500 opacity-70" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[70vh] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-white p-8">
          <Dialog.Title asChild>
            <h1 className="p-4 text-xl">{title}</h1>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="p-4 text-lg">{description}</p>
          </Dialog.Description>
          <div className="flex justify-end gap-4 pt-4">
            <Dialog.Close asChild>
              <Button theme="white">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button theme="danger" onClick={onDelete}>
                {confirmButtonText}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
