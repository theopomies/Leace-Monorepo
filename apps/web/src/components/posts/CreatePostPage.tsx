import { trpc } from "../../utils/trpc";
import { PostFormData } from "../shared/post/PostForm";
import axios from "axios";
import { PropertyListingForm } from "./PropertyListingForm";
import { DocType } from "@prisma/client";

export const CreatePostPage = () => {
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
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
    });
    return postCreated;
  };

  const handleUploadImages = async (files: File[], postId?: string) => {
    if (files && files.length > 0 && postId) {
      await Promise.all(
        Array.from(files).map(async (image) => {
          uploadImage
            .mutateAsync({ postId, fileType: image.type })
            .then(async (url) => {
              if (url) {
                await axios.put(url, image);
              }
            });
        }),
      );
    }
  };

  const handleUploadDocs = async (files: File[], postId?: string) => {
    if (files && files.length > 0 && postId) {
      await Promise.all(
        Array.from(files).map(async (document) => {
          uploadDocument
            .mutateAsync({
              postId,
              fileType: document.type,
              docType: DocType.PROPERTY_TITLE,
            })
            .then(async (url) => {
              if (url) {
                await axios.put(url, document, {
                  headers: { "Content-Type": document.type },
                });
              }
            });
        }),
      );
    }
  };

  return (
    <div className="flex flex-grow bg-white p-3">
      <div className="flex flex-grow items-center justify-center rounded-md bg-gray-100 p-4">
        <PropertyListingForm
          onSubmit={handleSubmit}
          onImgsUpload={handleUploadImages}
          onDocsUpload={handleUploadDocs}
        />
      </div>
    </div>
  );
};
