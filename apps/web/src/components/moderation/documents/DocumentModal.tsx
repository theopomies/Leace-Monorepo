/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface DocumentModalProps {
  document: { id: string; url: string; valid: boolean; ext: string };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchDocuments: () => void;
}

export const DocumentModal = ({
  document,
  setShowModal,
  refetchDocuments,
}: DocumentModalProps) => {
  const documentValidation = trpc.moderation.documentValidation.useMutation();

  const handleClick = async () => {
    if (document) {
      await documentValidation
        .mutateAsync({ id: document.id, valid: !document.valid })
        .then(async () => {
          refetchDocuments();
          setShowModal(false);
        });
    }
  };

  return (
    <>
      <div className="px-auto fixed inset-0 z-50 flex justify-center p-5">
        <div
          className={`${
            document.ext === "pdf" ? "w-full" : "h-full"
          } flex items-center justify-center rounded-lg bg-slate-50 shadow-lg`}
        >
          {document.ext === "pdf" ? (
            <object
              data={document.url}
              type="application/pdf"
              className="mr-10 h-full w-full rounded-tl-lg rounded-bl-lg shadow-xl"
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
              className="mr-10 h-full w-full rounded-tl-lg rounded-bl-lg shadow-xl"
            />
          )}

          <div className="mr-9 flex items-center justify-center gap-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
            <Button
              onClick={handleClick}
              theme={document.valid ? "danger" : "success"}
            >
              {document.valid ? "Unverify" : "Verify"}
            </Button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
