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
  primary:
    "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-indigo-300",
  danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-red-300",
  success:
    "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-emerald-300",
  white: "bg-white text-black shadow-sm hover:bg-gray-50 disabled:bg-gray-300",
  grey: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-300",
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
            : `rounded-md font-medium ${themeStyles[theme]} px-4 py-2 text-white ` +
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
