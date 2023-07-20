import {
  ChangeEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
} from "react";

export type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  ({ type?: "checkbox" } | { type: "radio"; name: string; value: string }) & {
    children: React.ReactNode;
  };

export function Checkbox({
  type = "checkbox",
  children,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e);
  };

  return (
    <label
      className={
        (checked ? "bg-indigo-500" : "bg-indigo-200") +
        " inline-block cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-white"
      }
    >
      {children}
      <input
        type={type}
        className="pointer-events-none absolute opacity-0"
        {...props}
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
}
