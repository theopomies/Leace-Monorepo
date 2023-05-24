import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { DisplayPost } from "./DisplayPost";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const { data: post } = trpc.post.getPostById.useQuery({ postId });
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: images } = trpc.image.getSignedPostUrl.useQuery(postId);
  const { data: documents, refetch: refetchImages } =
    trpc.document.getSignedUrl.useQuery({ postId });
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchImages();
  };

  return (
    <div className="h-full w-full bg-slate-100">
      {post && post.attribute && (
        <DisplayPost
          post={post}
          attribute={post.attribute}
          images={images}
          documents={documents}
          handleDeleteDoc={handleDeleteDoc}
          userId={session.userId}
        />
      )}
    </div>
  );
};
