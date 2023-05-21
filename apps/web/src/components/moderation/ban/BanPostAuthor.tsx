import { trpc } from "../../../utils/trpc";
import { Ban } from ".";

export interface BanPostAuthorProps {
  postId: string;
}

export const BanPostAuthor = ({ postId }: BanPostAuthorProps) => {
  const { data: post } = trpc.moderation.post.getPostById.useQuery(postId);
  if (!post) return null;
  return <Ban userId={post.createdById} />;
};
