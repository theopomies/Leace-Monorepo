import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm, PostFormData } from "../shared/post/PostForm";
import axios from "axios";

export const CreatePostPage = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const post = trpc.post.createPost.useMutation();

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();

  const uploadImage = trpc.image.putSignedUrl.useMutation();
  const [images, setImages] = useState<File[] | undefined>();

  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const [documents, setDocuments] = useState<File[] | undefined>();

  const handleSubmit = async (data: PostFormData) => {
    const { id: postId } = await post.mutateAsync({
      title: data.title,
      desc: data.description,
      content: "",
    });
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
    if (images && images.length > 0) {
      images.map(async (image) => {
        await uploadImage
          .mutateAsync({ postId, fileType: image.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, image);
            }
          });
      });
    }
    if (documents && documents.length > 0) {
      documents.map(async (document) => {
        await uploadDocument
          .mutateAsync({ postId, fileType: document.type })
          .then(async (url) => {
            if (url)
              await axios.put(url, document, {
                headers: { "Content-Type": document.type },
              });
          });
      });
    }
    router.push(`/users/${userId}/posts/${postId}`);
  };

  const handleImage =
    (setter: Dispatch<SetStateAction<File[] | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setter(Array.from(event.target.files));
      }
    };

  const handleDocuments =
    (setter: Dispatch<SetStateAction<File[] | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setter(Array.from(event.target.files));
      }
    };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-full">
      <Header heading={"Create Post"} />
      <PostForm
        OnSubmit={handleSubmit}
        OnCancel={handleCancel}
        setImages={handleImage(setImages)}
        setDocuments={handleDocuments(setDocuments)}
        documents={documents}
        images={images}
      />
    </div>
  );
};
