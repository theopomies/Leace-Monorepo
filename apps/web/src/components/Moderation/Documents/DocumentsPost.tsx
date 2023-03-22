import { trpc } from "../../../utils/trpc";
import { DocumentsList } from "./DocumentsList";

export interface DocumentsPostProps {
  postId: string;
}

export const DocumentsPost = ({ postId }: DocumentsPostProps) => {
  const { data: documents, refetch: refetchDocuments } =
    trpc.document.GetSignedPostUrl.useQuery(postId);

  if (documents && refetchDocuments)
    return (
      <DocumentsList
        documents={documents}
        refetchDocuments={refetchDocuments}
      />
    );
  return <p>No documents</p>;
};
