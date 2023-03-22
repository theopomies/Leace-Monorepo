import { DocumentsPost } from "./DocumentsPost";
import { DocumentsUser } from "./DocumentsUser";

export interface DocumentsProps {
  userId?: string;
  postId?: string;
}

export const Documents = ({ userId, postId }: DocumentsProps) => {
  if (userId && !postId) return <DocumentsUser userId={userId} />;
  else if (postId && !userId) return <DocumentsPost postId={postId} />;
  return <></>;
};
