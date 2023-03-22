import { trpc } from "../../../utils/trpc";
import { DocumentsList } from "./DocumentsList";

export interface DocumentsUserProps {
  userId: string;
}

export const DocumentsUser = ({ userId }: DocumentsUserProps) => {
  const { data: documents, refetch: refetchDocuments } =
    trpc.document.GetSignedUserUrl.useQuery(userId);

  if (documents && refetchDocuments)
    return (
      <DocumentsList
        documents={documents}
        refetchDocuments={refetchDocuments}
      />
    );
  return <p>No documents</p>;
};
