import { DisplayPost } from "../users/posts/DisplayProperty";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const { data: post } = trpc.post.getPostById.useQuery({ postId });

  useEffect(() => {
    console.log(post, post?.attribute);
  }, [post]);

  return (
    <div className="h-full bg-slate-100">
      {post && post.attribute && (
        <DisplayPost post={post} attribute={post.attribute} />
      )}
    </div>
  );
};
