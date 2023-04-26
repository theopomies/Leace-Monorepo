import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export type InputProps = { overrideStyles?: boolean } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({
  overrideStyles = false,
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={
        overrideStyles
          ? className
          : "rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none " +
            className
      }
      {...props}
    />
  );
}
