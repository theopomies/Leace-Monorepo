import React, { MouseEventHandler, useState } from "react";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm, PostFormData } from "../shared/post/PostForm";
import axios from "axios";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";

export const CreatePostPage = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { renderToast } = useToast();
  const post = trpc.post.createPost.useMutation();
  const [postId, setPostId] = useState<string | undefined>();

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();

  const uploadImage = trpc.image.putSignedUrl.useMutation();

  const uploadDocument = trpc.document.putSignedUrl.useMutation();

  const handleSubmit = async (data: PostFormData) => {
    const { id: postId } = await post.mutateAsync({
      title: data.title,
      desc: data.description,
      content: "",
    });
    setPostId(postId);
    await updatePost.mutateAsync({
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
      size: data.size,
      price: data.price,
    });
    router.push(`/users/${userId}/posts/${postId}`);
    renderToast(
      <>
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Your property is now posted ✅</ToastDescription>
      </>,
    );
  };

  const handleUploadImages = (files: File[]) => {
    if (files && files.length > 0 && postId) {
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

  const handleUploadDocs = (files: File[]) => {
    if (files && files.length > 0 && postId) {
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

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="flex w-full flex-grow flex-col">
      <Header heading={"Create Post"} />
      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onImgsUpload={handleUploadImages}
        onDocsUpload={handleUploadDocs}
      />
    </div>
  );
};
