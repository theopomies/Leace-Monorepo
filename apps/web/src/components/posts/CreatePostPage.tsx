import React, { MouseEventHandler } from "react";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm, PostFormData } from "../shared/post/PostForm";
import axios from "axios";

export const CreatePostPage = () => {
  const router = useRouter();
  const post = trpc.post.createPost.useMutation();

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();

  const uploadImage = trpc.image.putSignedUrl.useMutation();

  const uploadDocument = trpc.document.putSignedUrl.useMutation();

  const handleSubmit = async (data: PostFormData) => {
    const postCreated = await post.mutateAsync({
      title: data.title,
      desc: data.description,
      content: "",
      constructionDate: new Date(data.constructionDate + "T00:00:00.000Z"),
      energyClass: data.energyClass,
      estimatedCosts: data.estimatedCosts,
      ges: data.ges,
      nearedShops: data.nearestShops,
    });
    await updatePost.mutateAsync({
      postId: postCreated.id,
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
      internetFiber: data.internetFiber,
      securityAlarm: data.securityAlarm,
      price: data.price,
      size: data.size,
    });
    return postCreated;
  };

  const handleUploadImages = (files: File[], postId?: string) => {
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

  const handleUploadDocs = (files: File[], postId?: string) => {
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
        onSubmitNew={handleSubmit}
        onCancel={handleCancel}
        onImgsUpload={handleUploadImages}
        onDocsUpload={handleUploadDocs}
      />
    </div>
  );
};
