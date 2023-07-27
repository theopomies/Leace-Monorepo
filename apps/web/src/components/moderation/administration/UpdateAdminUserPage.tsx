/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
import { trpc } from "../../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../../shared/Header";
import { useRouter } from "next/router";
import axios from "axios";
import { UserForm, UserFormData } from "../../shared/user/UserForm";
import { cropImage } from "../../../utils/cropImage";

export function UpdateAdminUserPage({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: user } = trpc.moderation.user.getUser.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const updateAttributes = trpc.attribute.updateUserAttributes.useMutation();

  const { data: imageGet, refetch: refetchImageGet } =
    trpc.moderation.image.getSignedUserUrl.useQuery({ userId });
  const uploadImage = trpc.moderation.image.putSignedUrl.useMutation();
  const deleteImage = trpc.moderation.image.deleteSignedUrl.useMutation();

  const { data: documentsGet, refetch: refetchDocumentsGet } =
    trpc.moderation.document.getSignedUrl.useQuery({ userId });
  const uploadDocument = trpc.moderation.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.moderation.document.deleteSignedUrl.useMutation();

  const handleSubmit = async (data: UserFormData) => {
    await updateUser.mutateAsync({
      userId,
      birthDate: new Date(data.birthDate + "T00:00:00.000Z"),
      firstName: data.firstName,
      lastName: data.lastName,
      description: data.description,
    });
    if (user?.role === Role.TENANT) {
      await updateAttributes.mutateAsync({
        userId,
        location: data.location,
        maxPrice: data.maxPrice,
        minPrice: data.minPrice,
        maxSize: data.maxSize,
        minSize: data.minSize,
        furnished: data.furnished,
        homeType: data.homeType,
        terrace: data.terrace,
        pets: data.pets,
        smoker: data.smoker,
        disability: data.disability,
        garden: data.garden,
        parking: data.parking,
        elevator: data.elevator,
        pool: data.pool,
      });
    }
    router.push(`administration/users/${userId}`);
  };

  const handleUploadImg = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      cropImage(file, async (croppedBlob) => {
        await uploadImage
          .mutateAsync({ userId, fileType: croppedBlob.type })
          .then(async (url) => {
            if (url && event.target.files) {
              await axios.put(url, croppedBlob);
              refetchImageGet();
            }
          });
      });
    }
  };

  const handleDeleteImg = async () => {
    if (imageGet) {
      await deleteImage
        .mutateAsync({ userId, imageId: imageGet.id })
        .then(() => {
          refetchImageGet();
        });
    }
  };

  const handleUploadDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).map(async (document) => {
        await uploadDocument
          .mutateAsync({ userId, fileType: document.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, document, {
                headers: { "Content-Type": document.type },
              });
              refetchDocumentsGet();
            }
          });
      });
    }
  };

  const handleDeleteDoc = async (documentId: string) => {
    await deleteDocument.mutateAsync({ userId, documentId });
    refetchDocumentsGet();
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-full">
      <Header heading="Update Profile" />
      <UserForm
        user={user}
        onImgUpload={handleUploadImg}
        onImgDelete={handleDeleteImg}
        imageGet={imageGet}
        onDocsUpload={handleUploadDocs}
        onDocDelete={handleDeleteDoc}
        documentsGet={documentsGet}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
