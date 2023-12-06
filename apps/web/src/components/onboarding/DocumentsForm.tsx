import { useRef, useState } from "react";
import { FileInput } from "../shared/forms/FileInput";
import { Button } from "../shared/button/Button";
import {
  documentTypes,
  getDocumentsOfType,
  DocumentType,
  identityDocumentTypes,
  residenceDocumentTypes,
  professionalDocumentTypes,
  administrativeDocumentTypes,
  financialDocumentTypes,
} from "@leace/api/src/utils/types";
import { Select } from "../shared/button/Select";
import { DocType, Role } from "@prisma/client";
import { IoTrash } from "react-icons/io5";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";
import { trpc } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import axios from "axios";

export function OnboardingDocumentsForm({ userId }: { userId: string }) {
  const { data: user, isLoading: userIsLoading } =
    trpc.user.getUserById.useQuery({ userId });
  const { data: documents, isLoading: documentsAreLoading } =
    trpc.document.getSignedUrl.useQuery({ userId });
  const isLoading = userIsLoading || documentsAreLoading;
  const utils = trpc.useContext();
  const uploadFile = trpc.document.putSignedUrl.useMutation();

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (files: { file: File; type: DocType }[]) => {
    Promise.all(
      files.map((file) =>
        uploadFile
          .mutateAsync({
            userId,
            docType: file.type,
            fileType: file.file.type,
          })
          .then(async (url) => {
            if (url) {
              await axios.put(url, file.file, {
                headers: { "Content-Type": file.file.type },
              });
            }
          }),
      ),
    )
      .then(() => {
        utils.document.invalidate();
        utils.onboarding.invalidate();
        utils.user.invalidate();
        utils.auth.invalidate();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="h-2 w-[90%] bg-indigo-500" />
      <div className="mx-64 mb-20 flex flex-grow flex-col gap-12 text-lg">
        <div>
          <h1 className="mt-20 text-center text-4xl">
            One more thing, we will need some documents to ensure the safety of
            our community
          </h1>
          <p className="mt-12 text-center text-slate-500">
            Note that only some documents are required, you can upload the other
            ones later in the application
          </p>
        </div>
        {isLoading || !user?.role ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <DocumentsForm
              formRef={formRef}
              onSubmit={handleSubmit}
              role={user.role}
              documents={documents ?? []}
            />
            <div className="flex w-full justify-end pr-12">
              <Button onClick={() => formRef.current?.requestSubmit()}>
                Finish setting me up
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function DocumentsForm({
  formRef,
  onSubmit,
  role,
  documents,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  onSubmit: (files: { file: File; type: DocType }[]) => void;
  role: Role;
  documents: { type: DocType | null; url: string }[];
}) {
  const { renderToast } = useToast();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      renderToast(
        <>
          <ToastTitle>Missing Required Documents</ToastTitle>
          <ToastDescription>
            Please upload all required documents
          </ToastDescription>
        </>,
      );
      return;
    }
    // Checked in canSubmit
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onSubmit(files.map((file) => ({ file: file.file!, type: file.docType! })));
  };
  const [files, setFiles] = useState<
    { docType?: DocType; documentType: DocumentType; file?: File; id: number }[]
  >([]);

  const addAnother = (documentType: DocumentType) => {
    setFiles((files) => [
      ...files,
      {
        documentType,
        id: Math.random() * 1000000,
      },
    ]);
  };

  const requiredDocumentTypes =
    documentTypesRequiredByRole[
      role as keyof typeof documentTypesRequiredByRole
    ];

  const documentTypes =
    documentTypesByRole[role as keyof typeof documentTypesByRole];

  const everyFileIsValid = files.every(
    (file) =>
      file.file !== undefined &&
      file.docType !== undefined &&
      requiredDocumentTypes.includes(file.documentType),
  );
  const hasUploadedAllRequiredDocuments = requiredDocumentTypes.every(
    (requiredDocumentType) =>
      files.some((file) => file.documentType === requiredDocumentType) ||
      documents.some(
        (document) =>
          docTypeToDocumentType(document.type) === requiredDocumentType,
      ),
  );
  const canSubmit = everyFileIsValid && hasUploadedAllRequiredDocuments;

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="rounded-xl bg-white py-4 px-8 shadow-lg">
        {documentTypes.map((documentType) => {
          const filesOfType = files.filter(
            (file) => file.documentType === documentType,
          );
          const cantAddAnother = filesOfType.some(
            (file) => file.file === undefined || file.docType === undefined,
          );
          const label = documentTypeLabels[documentType];

          return (
            <div key={documentType} className="">
              <h4 className="p-2 text-lg">
                {label}
                <span className="text-indigo-600">
                  {requiredDocumentTypes.includes(documentType) ? " *" : ""}
                </span>
              </h4>
              <div className="flex flex-col gap-1">
                {filesOfType.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-md border bg-white py-2 px-4"
                  >
                    <div>
                      <Select
                        value={file.docType}
                        placeholder="Document type"
                        options={getDocumentsOfType(
                          documentType as DocumentType,
                        ).map((value) => ({
                          value,
                          label: docTypeToLabels[value],
                        }))}
                        onChange={(docType) => {
                          setFiles((files) =>
                            files.map((f) =>
                              f.id == file.id
                                ? { ...f, docType: docType as DocType }
                                : f,
                            ),
                          );
                        }}
                      />
                    </div>
                    {file.docType !== undefined ? (
                      <>
                        <FileInput
                          id="identity"
                          name="identity"
                          accept="image/*"
                          onChange={(event) => {
                            if (event.target.files) {
                              const uploadedFile = event.target.files[0];
                              setFiles((files) =>
                                files.map((f) =>
                                  f.id == file.id
                                    ? { ...f, file: uploadedFile }
                                    : f,
                                ),
                              );
                            }
                          }}
                        >
                          {file.file !== undefined ? "Change" : "Upload"}{" "}
                          document
                        </FileInput>
                        {file.file !== undefined && <p>{file.file.name}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-slate-600">
                        Please select a type of document
                      </p>
                    )}
                    <div className="flex flex-grow justify-end">
                      <Button
                        theme="danger"
                        onClick={() => {
                          setFiles((files) =>
                            files.filter((f) => f.id !== file.id),
                          );
                        }}
                      >
                        <IoTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-right">
                <Button
                  disabled={cantAddAnother}
                  onClick={() => addAnother(documentType as DocumentType)}
                >
                  Add {filesOfType.length ? "another" : "one"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}

export const documentTypeLabels = {
  [documentTypes.IDENTITY]: "Identity documents",
  [documentTypes.RESIDENCE]: "Proofs of residence",
  [documentTypes.PROFESSIONAL]: "Proofs of professional situation",
  [documentTypes.ADMINISTRATIVE]: "Company administrative documents",
  [documentTypes.FINANCIAL]: "Proofs of financial situation",
} as const;

export const documentTypesByRole = {
  [Role.TENANT]: [
    documentTypes.IDENTITY,
    documentTypes.RESIDENCE,
    documentTypes.PROFESSIONAL,
    documentTypes.FINANCIAL,
  ],
  [Role.OWNER]: [documentTypes.IDENTITY, documentTypes.RESIDENCE],
  [Role.AGENCY]: [
    documentTypes.IDENTITY,
    documentTypes.RESIDENCE,
    documentTypes.PROFESSIONAL,
    documentTypes.ADMINISTRATIVE,
  ],
} as const;

function docTypeToDocumentType(docType: DocType | null) {
  if (docType === null) return null;
  if ((identityDocumentTypes as readonly string[]).includes(docType)) {
    return documentTypes.IDENTITY;
  }
  if ((residenceDocumentTypes as readonly string[]).includes(docType)) {
    return documentTypes.RESIDENCE;
  }
  if ((professionalDocumentTypes as readonly string[]).includes(docType)) {
    return documentTypes.PROFESSIONAL;
  }
  if ((administrativeDocumentTypes as readonly string[]).includes(docType)) {
    return documentTypes.ADMINISTRATIVE;
  }
  if ((financialDocumentTypes as readonly string[]).includes(docType)) {
    return documentTypes.FINANCIAL;
  }

  return null;
}

export const documentTypesRequiredByRole = {
  [Role.TENANT]: [documentTypes.IDENTITY],
  [Role.OWNER]: [documentTypes.IDENTITY],
  [Role.AGENCY]: [documentTypes.IDENTITY, documentTypes.ADMINISTRATIVE],
} as Record<Role, DocumentType[]>;

export const docTypeToLabels = Object.entries(DocType).reduce(
  (acc, [key, value]) => {
    acc[key as DocType] = value
      .split("_")
      .map(
        (str) => str[0]?.toLocaleUpperCase() + str.slice(1).toLocaleLowerCase(),
      )
      .join(" ");
    return acc;
  },
  {} as Record<DocType, string>,
);
