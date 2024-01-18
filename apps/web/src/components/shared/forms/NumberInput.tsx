import { Input, InputProps } from "./Input";

export type NumberInputProps = InputProps & { unit?: string };

export function NumberInput({ unit, ...props }: NumberInputProps) {
  return (
    <div className="relative inline-block">
      <Input
        min={0}
        // only allow integers
        pattern="\d*"
        {...props}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          if (isNaN(value)) {
            props.onChange?.(e);
            return;
          }
          e.target.value = Math.round(value).toString();
          e.target.valueAsNumber = Math.round(value);
          props.onChange?.(e);
        }}
        type="number"
      />
      {unit && (
        <div className="absolute right-6 top-0 flex h-full items-center px-2">
          {unit}
        </div>
      )}
    </div>
  );
}
