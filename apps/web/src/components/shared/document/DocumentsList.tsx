/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DocumentModal } from "./DocumentModal";
import { Check, Cross } from "../../moderation/Icons";
import Link from "next/link";

type Document = {
  id: string;
  url: string;
  valid: boolean;
  ext: string;
};
export interface DocumentsListProps {
  documents: {
    id: string;
    url: string;
    valid: boolean;
    ext: string;
  }[];
  handleDeleteDoc: (id: string) => Promise<void>;
}

export const DocumentsList = ({
  documents,
  handleDeleteDoc,
}: DocumentsListProps) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>();

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleModalClose = () => {
    setSelectedDocument(null);
  };

  return (
    <div className="my-5 flex justify-center gap-4">
      {documents.map((doc, index) => (
        <div key={index} className="relative">
          {doc.ext === "pdf" ? (
            <Link href={doc.url}>
              <img
                src="/pdfLogo.jpg"
                referrerPolicy="no-referrer"
                alt="document"
                className="w-32 cursor-pointer"
              />
            </Link>
          ) : (
            <img
              src={doc.url}
              referrerPolicy="no-referrer"
              alt="document"
              className="w-32 cursor-pointer"
              onClick={() => handleDocumentClick(doc)}
            />
          )}
          {doc.valid && (
            <div className="absolute -right-1 -top-1 inline-flex w-5 items-center justify-center rounded-full bg-green-500 p-1 text-white">
              <Check />
            </div>
          )}
          <div
            onClick={() => handleDeleteDoc(doc.id)}
            className="absolute -right-1 -top-1 inline-flex w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 p-1 text-white"
          >
            <Cross />
          </div>
        </div>
      ))}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          setShowModal={handleModalClose}
        />
      )}
    </div>
  );
};
