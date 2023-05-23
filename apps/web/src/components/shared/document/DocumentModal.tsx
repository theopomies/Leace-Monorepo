/* eslint-disable @next/next/no-img-element */
import { Button } from "../../shared/button/Button";

export interface DocumentModalProps {
  document: { id: string; url: string; valid: boolean; ext: string };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DocumentModal = ({
  document,
  setShowModal,
}: DocumentModalProps) => {
  return (
    <>
      <div className="px-auto fixed inset-0 z-50 flex justify-center p-5">
        <div
          className={`${
            document.ext === "pdf" ? "w-full" : "h-full"
          } flex items-center justify-center rounded-lg bg-slate-50 shadow-lg`}
        >
          <img
            src={document.url}
            referrerPolicy="no-referrer"
            alt="document"
            className="mr-10 h-full w-full rounded-bl-lg rounded-tl-lg shadow-xl"
          />
          <div className="mr-9 flex items-center justify-center gap-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};