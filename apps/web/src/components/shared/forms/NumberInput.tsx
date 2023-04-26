import { Input, InputProps } from "./Input";

export type NumberInputProps = InputProps & { unit?: string };

export function NumberInput({ unit, ...props }: NumberInputProps) {
  return (
    <div className="relative inline-block">
      <Input {...props} type="number" />
      {unit && (
        <div className="absolute right-6 top-0 flex h-full items-center px-2">
          {unit}
        </div>
      )}
    </div>
  );
}
