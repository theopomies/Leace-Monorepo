import * as PopoverPrimitives from "@radix-ui/react-popover";
import { Button } from "../../button/Button";

export interface PopoverProps {
  label: string;
  children: React.ReactNode;
}

export function Popover({ label, children }: PopoverProps) {
  return (
    <PopoverPrimitives.Root>
      <PopoverPrimitives.Trigger asChild>
        <Button theme="primary">{label}</Button>
      </PopoverPrimitives.Trigger>
      <PopoverPrimitives.Anchor />
      <PopoverPrimitives.Portal>
        <PopoverPrimitives.Content sideOffset={12}>
          {children}
        </PopoverPrimitives.Content>
      </PopoverPrimitives.Portal>
    </PopoverPrimitives.Root>
  );
}
