/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import axios from "axios";
import { cropImage } from "../../../utils/cropImage";
import { UserForm, UserFormData } from "../../shared/user/UserForm";
import {
  ToastDescription,
  ToastTitle,
  useToast,
} from "../../shared/toast/Toast";

export interface UpdateAdminUserPageProps {
  userId: string;
}

export function UpdateAdminUserPage({ userId }: UpdateAdminUserPageProps) {
  const router = useRouter();
  const [fileType, setFileType] = useState("");
  const { data: user, refetch: refetchUser } =
    trpc.moderation.user.getUser.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const updateAttributes = trpc.attribute.updateUserAttributes.useMutation();

  const uploadImage = trpc.moderation.image.putSignedUrl.useMutation();
  const { refetch: refetchPicture } =
    trpc.moderation.image.getSignedUserUrl.useQuery(
      {
        userId,
        fileType,
      },
      { enabled: false },
    );
  const { data: documents, refetch: refetchDocuments } =
    trpc.moderation.document.getSignedUrl.useQuery({ userId });
  const uploadDocument = trpc.moderation.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.moderation.document.deleteSignedUrl.useMutation();
  const { renderToast } = useToast();

  const handleSubmit = async (data: UserFormData) => {
    await updateUser.mutateAsync({
      userId,
      birthDate: new Date(data.birthDate + "T00:00:00.000Z"),
      firstName: data.firstName,
      lastName: data.lastName,
      description: data.description,
      country: data.country,
      job: data.job,
      creditScore: data.creditScore,
      employmentContract: data.employmentContract,
      income: data.income,
      maritalStatus: data.maritalStatus,
    });
    if (user?.role === Role.TENANT) {
      await updateAttributes.mutateAsync({
        userId,
        location: data.location,
        range: data.range,
        maxPrice: data.maxPrice,
        minPrice: data.minPrice,
        maxSize: data.maxSize,
        minSize: data.minSize,
        maxBedrooms: data.maxBedrooms,
        minBedrooms: data.minBedrooms,
        maxBathrooms: data.maxBathrooms,
        minBathrooms: data.minBathrooms,
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
        securityAlarm: data.securityAlarm,
        internetFiber: data.internetFiber,
      });
    }
    router.push(`/administration/users/${userId}`);
    renderToast(
      <>
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Profile is up to date ✅</ToastDescription>
      </>,
    );
  };

  const handleUploadImg = async (file: File | undefined) => {
    if (file) {
      setFileType(file.type);
      cropImage(file, async (croppedBlob) => {
        await uploadImage
          .mutateAsync({ userId, fileType: croppedBlob.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, croppedBlob).then(async () => {
                const { data: res } = await refetchPicture();
                await updateUser.mutateAsync({ userId, image: res });
                await refetchUser();
              });
            }
          });
      });
    }
  };

  const handleUploadDocs = (files: File[]) => {
    if (files && files.length > 0) {
      Array.from(files).map(async (document) => {
        await uploadDocument
          .mutateAsync({ userId, fileType: document.type })
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
    await deleteDocument.mutateAsync({ userId, documentId });
    refetchDocuments();
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserForm
      user={user}
      onImgUpload={handleUploadImg}
      onDocsUpload={handleUploadDocs}
      onDocDelete={handleDeleteDoc}
      documents={documents}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
