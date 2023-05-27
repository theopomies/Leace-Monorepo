import { trpc } from "../../../utils/trpc";
import { XOR } from "../../../utils/types";
import { DocumentsList } from "../../shared/document/DocumentsList";

type Document = {
  id: string;
  url: string;
  valid: boolean;
  ext: string;
};

export type DocumentsProps = XOR<{ userId: string }, { postId: string }>;

export const Documents = ({ userId, postId }: DocumentsProps) => {
  const { data: documents, refetch: refetchDocuments } =
    trpc.moderation.document.getSignedUrl.useQuery({
      userId: userId,
      postId: postId,
    });
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();
  const documentValidation =
    trpc.moderation.document.documentValidation.useMutation();

  const OnDelete = async (documentId: string) => {
    await deleteDocument.mutateAsync({ userId, postId, documentId });
    refetchDocuments();
  };

  const OnValidation = async (document: Document) => {
    if (document) {
      await documentValidation
        .mutateAsync({ id: document.id, valid: !document.valid })
        .then(async () => {
          refetchDocuments();
        });
    }
  };

  if (documents && documents.length > 0) {
    return (
      <DocumentsList
        documents={documents}
        isUserLogged={true}
        OnDelete={OnDelete}
        OnValidation={OnValidation}
      />
    );
  }
  return null;
};
