import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = {
  overrideStyles?: boolean;
  theme?: "primary" | "danger" | "success";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  className = "",
  theme = "primary",
  overrideStyles = false,
  ...props
}: ButtonProps) {
  const themeStyles = {
    primary: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    success: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
  };

  return (
    <button
      className={
        overrideStyles
          ? className
          : `rounded-md ${themeStyles[theme]} px-4 py-3 text-white ` + className
      }
      {...props}
    />
  );
}