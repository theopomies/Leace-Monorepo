import { DetailedHTMLProps, InputHTMLAttributes, Ref } from "react";

export type InputProps = {
  overrideStyles?: boolean;
  inputRef?: Ref<HTMLInputElement>;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function Input({
  overrideStyles = false,
  inputRef,
  className,
  ...props
}: InputProps) {
  return (
    <input
      ref={inputRef}
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
