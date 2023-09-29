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

  const { data: images, refetch: refetchImages } =
    trpc.image.getSignedPostUrl.useQuery({ postId });
  const uploadImage = trpc.image.putSignedUrl.useMutation();
  const deleteImage = trpc.image.deleteSignedPostUrl.useMutation();

  const { data: documents, refetch: refetchDocuments } =
    trpc.document.getSignedUrl.useQuery({ postId });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

  const handleSubmit = async (data: PostFormData) => {
    await updatePost.mutateAsync({
      postId,
      title: data.title,
      desc: data.description,
      content: "",
      constructionDate: new Date(data.constructionDate + "T00:00:00.000Z"),
      energyClass: data.energyClass,
      estimatedCosts: data.estimatedCosts,
      ges: data.ges,
      internetFiber: data.internetFiber,
      securityAlarm: data.securityAlarm,
      nearedShops: data.nearestShops,
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
    router.push(`/users/${post?.createdById}/posts/${postId}`);
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
    <div className="flex w-full flex-grow flex-col">
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
