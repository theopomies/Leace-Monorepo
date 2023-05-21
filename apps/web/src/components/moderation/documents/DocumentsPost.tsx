import { trpc } from "../../../utils/trpc";
import { DocumentsList } from "./DocumentsList";

export interface DocumentsPostProps {
  postId: string;
}

export const DocumentsPost = ({ postId }: DocumentsPostProps) => {
  const { data: documents, refetch: refetchDocuments } =
    trpc.moderation.document.getSignedPostUrl.useQuery(postId);

  if (documents && documents.length > 0 && refetchDocuments) {
    return (
      <DocumentsList
        documents={documents}
        refetchDocuments={refetchDocuments}
      />
    );
  }
  return <p className="text-center">No document</p>;
};
