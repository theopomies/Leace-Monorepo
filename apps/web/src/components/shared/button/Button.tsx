import React, { forwardRef } from "react";
import { Spinner } from "../Spinner";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = {
  loading?: boolean;
  overrideStyles?: boolean;
  theme?: "primary" | "danger" | "success" | "white" | "grey";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const themeStyles = {
  primary: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700",
  danger: "bg-red-500 hover:bg-red-600 active:bg-red-700",
  success: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700",
  white: "bg-white text-black shadow-sm hover:bg-gray-50",
  grey: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      loading = false,
      className = "",
      theme = "primary",
      overrideStyles = false,
      ...props
    },
    ref,
  ) {
    return (
      <button
        className={
          overrideStyles
            ? className
            : `rounded-md font-bold ${themeStyles[theme]} px-4 py-3 text-white ` +
              className
        }
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          props.children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
