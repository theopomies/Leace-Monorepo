import { XOR } from "../../../utils/types";
import { DocumentsPost } from "./DocumentsPost";
import { DocumentsUser } from "./DocumentsUser";

export type DocumentsProps = XOR<{ userId: string }, { postId: string }>;

export const Documents = ({ userId, postId }: DocumentsProps) => {
  if (userId) return <DocumentsUser userId={userId} />;
  if (postId) return <DocumentsPost postId={postId} />;
  return null;
};
