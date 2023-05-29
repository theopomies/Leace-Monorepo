/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DocumentModal } from "./DocumentModal";
import { Check, Cross } from "../../moderation/Icons";
import Link from "next/link";
import { Button } from "../button/Button";
import { Document } from "@prisma/client";

type DocumentWithUrl = Document & { url: string };

export interface DocumentsListProps {
  documents: DocumentWithUrl[] | undefined;
  isLoggedInOrAdmin?: boolean;
  OnDelete?: (documentId: string) => Promise<void>;
  OnValidation?: (document: DocumentWithUrl) => Promise<void>;
}

export const DocumentsList = ({
  documents,
  isLoggedInOrAdmin,
  OnDelete,
  OnValidation,
}: DocumentsListProps) => {
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentWithUrl | null>();

  const handleDocumentClick = (doc: DocumentWithUrl) => {
    setSelectedDocument(doc);
  };

  const handleModalClose = () => {
    setSelectedDocument(null);
  };

  if (!documents || documents.length === 0) return null;

  return (
    <div className="border-t py-5 text-center">
      <h2 className="mb-5 text-xl">Documents:</h2>
      <div className="my-5 flex justify-center gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="relative flex items-center">
            {doc.ext === "pdf" ? (
              <Link href={doc.url}>
                <img
                  src="/pdfLogo.jpg"
                  referrerPolicy="no-referrer"
                  alt="document"
                  className="w-32 cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
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
              <div className="absolute -right-1 -bottom-1 inline-flex w-5 items-center justify-center rounded-full bg-green-500 p-1 text-white">
                <Check />
              </div>
            )}
            {isLoggedInOrAdmin && OnDelete && (
              <Button
                theme="danger"
                onClick={() => OnDelete(doc.id)}
                overrideStyles
                className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-md bg-red-500 p-1 text-white hover:bg-white hover:text-red-500"
              >
                <Cross />
              </Button>
            )}
          </div>
        ))}
        {selectedDocument && (
          <DocumentModal
            document={selectedDocument}
            setShowModal={handleModalClose}
            OnValidation={OnValidation}
          />
        )}
      </div>
    </div>
  );
};
