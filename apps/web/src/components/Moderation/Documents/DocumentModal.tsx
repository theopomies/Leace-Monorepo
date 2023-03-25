/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";

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
                <a href={document.url}>click here to download the PDF file.</a>
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
            <button
              className="rounded-full bg-slate-400 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:shadow-lg focus:outline-none"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className={`${
                document.valid
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } rounded-full  px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear  hover:shadow-lg focus:outline-none`}
              type="button"
              onClick={handleClick}
            >
              {document.valid ? "Invalider" : "Valider"}
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};
