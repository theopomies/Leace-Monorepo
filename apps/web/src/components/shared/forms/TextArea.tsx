import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

export type TextAreaProps = { overrideStyles?: boolean } & DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function TextArea({
  overrideStyles = false,
  className,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={
        overrideStyles
          ? className
          : "mt-5 rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-start text-sm text-gray-900 focus:border-blue-600 focus:outline-none " +
            className
      }
      rows={rows}
      {...props}
    />
  );
}
