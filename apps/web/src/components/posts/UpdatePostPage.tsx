import { MouseEventHandler } from "react";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm, PostFormData } from "../shared/post/PostForm";
import axios from "axios";

export interface UpdatePostProps {
  postId: string;
}

export const UpdatePostPage = ({ postId }: UpdatePostProps) => {
  const router = useRouter();
  const { data: post } = trpc.post.getPostById.useQuery({ postId });
  const updatePost = trpc.post.updatePostById.useMutation();

  const updatePostAttributes =
    trpc.attribute.updatePostAttributes.useMutation();

  const { data: imagesGet, refetch: refetchImagesGet } =
    trpc.image.getSignedPostUrl.useQuery(postId);
  const uploadImage = trpc.image.putSignedPostUrl.useMutation();
  const deleteImage = trpc.image.deleteSignedPostUrl.useMutation();

  const { data: documentsGet, refetch: refetchDocumentsGet } =
    trpc.document.getSignedUrl.useQuery({
      postId,
    });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  const handleSubmit = async (data: PostFormData) => {
    await updatePost.mutateAsync({
      postId,
      title: data.title,
      desc: data.description,
      content: "",
    });
    await updatePostAttributes.mutateAsync({
      postId,
      location: data.location,
      homeType: data.homeType,
      furnished: data.furnished,
      terrace: data.terrace,
      pets: data.pets,
      smoker: data.smoker,
      garden: data.garden,
      parking: data.parking,
      elevator: data.elevator,
      pool: data.pool,
      disability: data.disability,
      price: data.price,
      size: data.size,
    });
    router.push(`/posts/${postId}`);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  const handleUploadImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).map(async (image) => {
        await uploadImage
          .mutateAsync({
            postId,
            fileType: image.type,
          })
          .then(async (url) => {
            await axios.put(url, image);
            refetchImagesGet();
          });
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage.mutateAsync({ postId, imageId });
    refetchImagesGet();
  };

  const handleUploadDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).map(async (document) => {
        await uploadDocument
          .mutateAsync({
            postId,
            fileType: document.type,
          })
          .then(async (url) => {
            if (url) {
              await axios.put(url, document, {
                headers: {
                  "Content-Type": document.type,
                },
              });
              refetchDocumentsGet();
            }
          });
      });
    }
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchDocumentsGet();
  };

  return (
    <div className="w-full">
      <Header heading={"Update Post"} />
      <PostForm
        post={post}
        OnSubmit={handleSubmit}
        OnCancel={handleCancel}
        OnImgsUpload={handleUploadImages}
        OnImgDelete={handleDeleteImage}
        imagesGet={imagesGet}
        OnDocsUpload={handleUploadDocs}
        OnDocDelete={handleDeleteDoc}
        documentsGet={documentsGet}
      />
    </div>
  );
};
