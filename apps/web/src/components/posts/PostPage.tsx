import { trpc } from "../../utils/trpc";
import { DisplayPost } from "./DisplayProperty";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const { data: post } = trpc.post.getPostById.useQuery({ postId });

  return (
    <div className="h-full w-full bg-slate-100">
      {post && post.attribute && (
        <DisplayPost post={post} attribute={post.attribute} />
      )}
    </div>
  );
};
