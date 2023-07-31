import React, { createContext } from "react";
import * as Toast from "@radix-ui/react-toast";
import { IoClose } from "react-icons/io5";

interface ToastContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setComponent: (component: React.ReactNode) => void;
}

const ToastContext = createContext<ToastContextProps>({
  open: false,
  setOpen: () => null,
  setComponent: () => null,
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [component, _setComponent] = React.useState<React.ReactNode>(null);

  const setComponent = React.useCallback(
    (component: React.ReactNode) => {
      _setComponent(component);
    },
    [_setComponent],
  );

  return (
    <ToastContext.Provider value={{ open, setOpen, setComponent }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
          open={open}
          onOpenChange={setOpen}
        >
          {component}
        </Toast.Root>
        <Toast.Viewport className="fixed top-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const closeToast = () => {
    context.setOpen(false);
    context.setComponent(null);
  };

  const renderToast = (component: React.ReactNode) => {
    closeToast();
    setTimeout(() => {
      context.setComponent(component);
      context.setOpen(true);
    }, 100);
  };

  return { renderToast, closeToast };
};

export const ToastCloseButton = () => (
  <Toast.Close className="rounded-md border p-1 hover:bg-indigo-100 focus:bg-indigo-100 active:bg-indigo-100">
    <IoClose />
  </Toast.Close>
);

export const ToastDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Toast.Description className="text-sm text-gray-500 [grid-area:_description]">
    {children}
  </Toast.Description>
);

export const ToastTitle = ({ children }: { children: React.ReactNode }) => (
  <Toast.Title className="text-slate12 [ mb-[5px] text-[15px] font-medium [grid-area:_title]">
    {children}
  </Toast.Title>
);

export const ToastAction = ({
  children,
  altText,
}: {
  children: React.ReactNode;
  altText: string;
}) => (
  <Toast.Action className="[grid-area:_action]" altText={altText} asChild>
    {children}
  </Toast.Action>
);
