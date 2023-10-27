import { useEffect, useRef, useState } from "react";
import { ReportReason } from "@prisma/client";
import { DotsSvg } from "../icons/DotsSvg";
import { DialogButton } from "../button/DialogButton";
import { ReportDialog } from "../forms/ReportDialog";

export interface MatchActionsProps {
  fullName: string;
  onReport: (data: { reason: ReportReason; description: string }) => void;
  onDelete: () => Promise<void>;
}

export function MatchActions({
  fullName,
  onReport,
  onDelete,
}: MatchActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        dialogIsOpen == false
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dialogIsOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        className="inline-flex items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <DotsSvg />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow">
          <div className="py-2">
            <div className="cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500">
              <ReportDialog
                fullName={fullName}
                onReport={onReport}
                setOpen={setDialogIsOpen}
              />
            </div>
          </div>
          <div className="py-2">
            <div className="cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500">
              <DialogButton
                buttonText="Delete match"
                title={`Delete your match with ${fullName}`}
                description={`Are you sure you want to delete your match with ${fullName} ?`}
                confirmButtonText="Yes, delete my match"
                onDelete={onDelete}
                noButtonStyle={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
