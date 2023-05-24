import * as Popover from "@radix-ui/react-popover";
import { Button } from "../../button/Button";

export interface ContractPopoverProps {
  label: string;
  children: React.ReactNode;
}

export function ContractPopover({ label, children }: ContractPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button theme="primary">{label}</Button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content sideOffset={12}>{children}</Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
