import { useRef } from "react";
import { Button } from "../shared/button/Button";
import { DocType } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Spinner } from "../shared/Spinner";
import axios from "axios";
import { DocumentsForm } from "../shared/document/DocumentsForm";

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
