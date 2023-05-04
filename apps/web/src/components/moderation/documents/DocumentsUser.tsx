import { trpc } from "../../../utils/trpc";
import { DocumentsList } from "./DocumentsList";

export interface DocumentsUserProps {
  userId: string;
}

export const DocumentsUser = ({ userId }: DocumentsUserProps) => {
  const { data: documents, refetch: refetchDocuments } =
    trpc.moderation.document.getSignedUserUrl.useQuery(userId);

  if (documents && documents.length > 0 && refetchDocuments)
    return (
      <DocumentsList
        documents={documents}
        refetchDocuments={refetchDocuments}
      />
    );
  return <p className="text-center">No document</p>;
};
