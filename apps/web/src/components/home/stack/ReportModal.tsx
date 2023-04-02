import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function ReportModal({ isOpen, setIsOpen }: ModalProps) {
  return (
    <AnimatePresence>
      <Overlay isSelected={isOpen} onClose={() => setIsOpen(false)} onTop />
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-40 z-50 rounded bg-white p-4"
        >
          <div className="flex flex-col items-center gap-4">
            <h1 className="center text-xl">Report</h1>
            <label className="pt-5">
              <p>Why are you reporting this post?</p>
              <select className="w-full">
                <option disabled selected>
                  Select a reason
                </option>
                <option>Scam</option>
                <option>Inapropriate</option>
                <option>Other</option>
              </select>
            </label>
            <label className="pt-5">
              <p>
                Please share more information so that we can treat your report
                faster.
              </p>
              <textarea className="min-h-[10rem] w-full border border-gray-500" />
            </label>
            <div className="flex gap-8">
              <button
                className="bg-red-400 p-4 text-white hover:bg-red-600"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-400 p-4 text-white hover:bg-green-600"
                onClick={() => setIsOpen(false)}
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
