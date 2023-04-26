/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Check, Cross } from "../Icons";
import { DocumentModal } from "./DocumentModal";

export interface DocumentsListProps {
  documents: {
    id: string;
    url: string;
    valid: boolean;
    ext: string;
  }[];
  refetchDocuments: () => void;
}

export const DocumentsList = ({
  documents,
  refetchDocuments,
}: DocumentsListProps) => {
  const [showModal, setShowModal] = useState(false);

  const { data: pdfLogo } = trpc.document.getSignedAssetUrl.useQuery({
    name: "pdfLogo.jpg",
  });

  return (
    <div className="flex justify-center gap-4">
      {documents.map((doc, index) => (
        <div key={index} className="relative">
          {doc.ext === "pdf" && pdfLogo ? (
            <img
              src={pdfLogo}
              referrerPolicy="no-referrer"
              alt="document"
              className="w-32 cursor-pointer shadow-xl"
              onClick={() => setShowModal(true)}
            />
          ) : (
            <img
              src={doc.url}
              referrerPolicy="no-referrer"
              alt="document"
              className="w-32 cursor-pointer shadow-xl"
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
            <DocumentModal
              document={doc}
              setShowModal={setShowModal}
              refetchDocuments={refetchDocuments}
            />
          )}
        </div>
      ))}
    </div>
  );
};
