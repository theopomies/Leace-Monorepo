import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { DisplayPost } from "./DisplayProperty";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const { data: post } = trpc.post.getPostById.useQuery({ postId });
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: images } = trpc.image.getSignedPostUrl.useQuery(postId);

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  const role = session.role;

  return (
    <div className="h-full w-full bg-slate-100">
      {post && post.attribute && (
        <DisplayPost
          post={post}
          attribute={post.attribute}
          images={images}
          role={role}
        />
      )}
    </div>
  );
};
