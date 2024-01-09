/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "../../shared/button/Button";
import { Document } from "@prisma/client";
import { IoCloseCircle } from "react-icons/io5";

export interface DocumentModalProps {
  document: Document & { url: string };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onValidation?: (document: Document & { url: string }) => Promise<void>;
}

export const DocumentModal = ({
  document,
  setShowModal,
  onValidation,
}: DocumentModalProps) => {
  return (
    <>
      <div className="px-auto fixed inset-0 z-50 flex justify-center p-20">
        <div className="flex flex-grow items-center justify-center rounded-lg bg-slate-50">
          {document.ext === "pdf" ? (
            <object
              data={document.url}
              type="application/pdf"
              className="h-full w-full rounded-lg"
            >
              <p>
                It appears you don&apos;t have a PDF plugin for this browser. No
                biggie... you can{" "}
                <Link href={document.url}>
                  click here to download the PDF file.
                </Link>
              </p>
            </object>
          ) : (
            <img
              src={document.url}
              referrerPolicy="no-referrer"
              alt="document"
              className="h-full w-full rounded-lg object-contain"
            />
          )}
        </div>
        <div
          onClick={() => setShowModal(false)}
          className="absolute top-5 right-5 rounded-full bg-indigo-400 p-1 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          <IoCloseCircle size={50} />
        </div>
        {onValidation && (
          <Button
            onClick={() => {
              onValidation(document);
              setShowModal(false);
            }}
            className="right-50 left-50 absolute bottom-5"
            theme={document.valid ? "danger" : "success"}
          >
            {document.valid ? "Unverify" : "Verify"}
          </Button>
        )}
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
