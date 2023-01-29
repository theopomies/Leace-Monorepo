/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { trpc } from "../utils/trpc";

const DocValidationModal = (props: {
  document: { id: string; url: string; valid: boolean; ext: string };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchDocuments: () => void;
}) => {
  const documentValidation = trpc.moderation.documentValidation.useMutation();

  const handleClick = async () => {
    if (document) {
      await documentValidation
        .mutateAsync({ id: props.document.id, valid: !props.document.valid })
        .then(async () => {
          props.refetchDocuments();
          props.setShowModal(false);
        });
    }
  };

  return (
    <>
      <div className="px-auto fixed inset-0 z-50 flex justify-center p-5">
        <div
          className={`${
            props.document.ext === "pdf" ? "w-full" : "h-full"
          } flex items-center justify-center rounded-lg bg-slate-50 shadow-lg`}
        >
          {props.document.ext === "pdf" ? (
            <object
              data={props.document.url}
              type="application/pdf"
              className="mr-10 h-full w-full rounded-tl-lg rounded-bl-lg shadow-xl"
            >
              <p>
                It appears you don&apos;t have a PDF plugin for this browser. No
                biggie... you can{" "}
                <a href={props.document.url}>
                  click here to download the PDF file.
                </a>
              </p>
            </object>
          ) : (
            <img
              src={props.document.url}
              referrerPolicy="no-referrer"
              alt="document"
              className="mr-10 h-full w-full rounded-tl-lg rounded-bl-lg shadow-xl"
            />
          )}

          <div className="mr-9 flex items-center justify-center gap-4">
            <button
              className="rounded-full bg-slate-400 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:shadow-lg focus:outline-none"
              type="button"
              onClick={() => props.setShowModal(false)}
            >
              Close
            </button>
            <button
              className={`${
                props.document.valid
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } rounded-full  px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear  hover:shadow-lg focus:outline-none`}
              type="button"
              onClick={handleClick}
            >
              {props.document.valid ? "Invalider" : "Valider"}
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};

const DocValidation = (props: { userId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [document, setDocument] = useState({
    id: "",
    url: "",
    valid: false,
    ext: "",
  });

  const { data: documents, refetch: refetchDocuments } =
    trpc.document.GetSignedUserUrl.useQuery(props.userId);

  if (documents && documents.length > 0) console.log(documents[0]);
  return (
    <div className="flex justify-center gap-4">
      {documents && documents.length > 0 ? (
        documents.map((doc, index) => (
          <div key={index} className="relative">
            {doc.ext === "pdf" ? (
              <img
                src="https://thesoftwarepro.com/wp-content/uploads/2019/12/microsoft-office-pdf-document-953x1024.jpg"
                referrerPolicy="no-referrer"
                alt="document"
                className="w-32 cursor-pointer shadow-xl"
                onClick={() => {
                  setDocument(doc);
                  setShowModal(true);
                }}
              />
            ) : (
              <img
                src={doc.url}
                referrerPolicy="no-referrer"
                alt="document"
                className="w-32 cursor-pointer shadow-xl"
                onClick={() => {
                  setDocument(doc);
                  setShowModal(true);
                }}
              />
            )}
            {doc.valid ? (
              <div className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-green-500 p-1 text-white">
                <svg
                  className="w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 p-1 text-white">
                <svg
                  className="w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Aucun document</p>
      )}
      {showModal && (
        <DocValidationModal
          document={document}
          setShowModal={setShowModal}
          refetchDocuments={refetchDocuments}
        />
      )}
    </div>
  );
};

export default DocValidation;
