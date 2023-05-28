import axios from "axios";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { DisplayPost } from "./DisplayPost";

export interface PostPageProps {
  postId: string;
}

export const PostPage = ({ postId }: PostPageProps) => {
  const { data: post } = trpc.post.getPostById.useQuery({ postId });
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: images, refetch: refetchImages } =
    trpc.image.getSignedPostUrl.useQuery(postId);
  const { data: documents, refetch: refetchDocuments } =
    trpc.document.getSignedUrl.useQuery({ postId });

  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();
  const deleteImage = trpc.image.deleteSignedPostUrl.useMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchDocuments();
  };

  const handleDeleteImg = async (imageId: string) => {
    await deleteImage.mutateAsync({ postId, imageId }).then(async (url) => {
      await axios.delete(url);
    });
    refetchImages();
  };

  return (
    <div className="h-full w-full bg-slate-100">
      {post && post.attribute && (
        <DisplayPost
          post={post}
          attribute={post.attribute}
          images={images}
          handleDeleteImg={handleDeleteImg}
          documents={documents}
          handleDeleteDoc={handleDeleteDoc}
          userId={session.userId}
        />
      )}
    </div>
  );
};
