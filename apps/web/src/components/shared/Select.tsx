/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "../Moderation/Icons";

export interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const Select = ({ label, value, options, onChange }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div>
      <label
        id="listbox-label"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2" ref={selectRef}>
        <button
          type="button"
          className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center">
            <span className="ml-3 block truncate">{value}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        {open && (
          <motion.div
            className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: "-2vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.1 }}
          >
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white p-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="group relative cursor-default select-none rounded-md py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                  id="listbox-option-0"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span
                      className={`ml-3 block truncate capitalize ${
                        option === value ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                  {option === value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-hover:text-white">
                      <Check />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};
