/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DocumentModal } from "./DocumentModal";
import { Check, Cross } from "../../moderation/Icons";

export interface DocumentsListProps {
  documents: {
    id: string;
    url: string;
    valid: boolean;
    ext: string;
  }[];
}

export const DocumentsList = ({ documents }: DocumentsListProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex justify-center gap-4">
      {documents.map((doc, index) => (
        <div key={index} className="relative">
          {doc.ext === "pdf" ? (
            <img
              src="/pdfLogo.jpg"
              referrerPolicy="no-referrer"
              alt="document"
              className="w-32 cursor-pointer"
              onClick={() => setShowModal(true)}
            />
          ) : (
            <img
              src={doc.url}
              referrerPolicy="no-referrer"
              alt="document"
              className="w-32 cursor-pointer"
              onClick={() => setShowModal(true)}
            />
          )}
          {doc.valid ? (
            <div className="absolute -right-1 -top-1 inline-flex w-5 items-center justify-center rounded-full bg-green-500 p-1 text-white">
              <Check />
            </div>
          ) : (
            <div className="absolute -right-1 -top-1 inline-flex w-5 items-center justify-center rounded-full bg-red-500 p-1 text-white">
              <Cross />
            </div>
          )}
          {showModal && (
            <DocumentModal document={doc} setShowModal={setShowModal} />
          )}
        </div>
      ))}
    </div>
  );
};
