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
    primary: "bg-indigo",
    danger: "bg-red",
    success: "bg-emerald",
  };

  return (
    <button
      className={
        overrideStyles
          ? className
          : `rounded-md ${themeStyles[theme]}-500 hover:${themeStyles[theme]}-600 px-4 py-3 text-white active:${themeStyles[theme]}-700 ` +
            className
      }
      {...props}
    />
  );
}
