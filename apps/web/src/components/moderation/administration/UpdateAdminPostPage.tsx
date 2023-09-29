import { MouseEventHandler } from "react";
import { Header } from "../../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { PostForm, PostFormData } from "../../shared/post/PostForm";
import axios from "axios";

export const UpdateAdminPostPage = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const { data: post } = trpc.moderation.post.getPost.useQuery({ postId });
  const updatePost = trpc.post.updatePostById.useMutation();

  const updatePostAttributes =
    trpc.attribute.updatePostAttributes.useMutation();

  const { data: images, refetch: refetchImages } =
    trpc.moderation.image.getSignedPostUrl.useQuery({ postId });
  const uploadImage = trpc.moderation.image.putSignedUrl.useMutation();
  const deleteImage = trpc.moderation.image.deleteSignedPostUrl.useMutation();

  const { data: documents, refetch: refetchDocuments } =
    trpc.moderation.document.getSignedUrl.useQuery({ postId });
  const uploadDocument = trpc.moderation.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.moderation.document.deleteSignedUrl.useMutation();

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
    router.push(`/administration/posts/${postId}`);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  const handleUploadImages = (files: File[]) => {
    if (files && files.length > 0) {
      Array.from(files).map(async (image) => {
        await uploadImage
          .mutateAsync({ postId, fileType: image.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, image);
            }
          });
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage.mutateAsync({ postId, imageId });
    refetchImages();
  };

  const handleUploadDocs = (files: File[]) => {
    if (files && files.length > 0) {
      Array.from(files).map(async (document) => {
        await uploadDocument
          .mutateAsync({ postId, fileType: document.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, document, {
                headers: { "Content-Type": document.type },
              });
            }
          });
      });
    }
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ postId, documentId });
    refetchDocuments();
  };

  return (
    <div className="w-full">
      <Header heading={"Update Post"} />
      <PostForm
        post={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onImgsUpload={handleUploadImages}
        onImgDelete={handleDeleteImage}
        images={images}
        onDocsUpload={handleUploadDocs}
        onDocDelete={handleDeleteDoc}
        documents={documents}
      />
    </div>
  );
};
