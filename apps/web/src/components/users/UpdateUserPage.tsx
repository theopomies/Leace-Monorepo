/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler, useState, useRef } from "react";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import axios from "axios";
import { cropImage } from "../../utils/cropImage";
import { UserForm, UserFormData } from "../shared/user/UserForm";
import { UserLayout } from "../shared/user/UserLayout";
import { Button } from "../shared/button/Button";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";
import { FileInput } from "../shared/forms/FileInput";

export interface UpdateUserPageProps {
  userId: string;
}

export function UpdateUserPage({ userId }: UpdateUserPageProps) {
  const router = useRouter();
  const [fileType, setFileType] = useState("");
  const { data: user, refetch: refetchUser } = trpc.user.getUserById.useQuery({
    userId,
  });
  const updateUser = trpc.user.updateUserById.useMutation();

  const updateAttributes = trpc.attribute.updateUserAttributes.useMutation();

  const uploadImage = trpc.image.putSignedUrl.useMutation();
  const { refetch: refetchPicture } = trpc.image.getSignedUserUrl.useQuery(
    {
      userId,
      fileType,
    },
    { enabled: false },
  );
  const { data: documents, refetch: refetchDocuments } =
    trpc.document.getSignedUrl.useQuery({ userId });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();
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
    router.push(`/users/${userId}`);
    renderToast(
      <>
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Your profile is up to date ✅</ToastDescription>
      </>,
    );
  };

  const handleUploadImg = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setFileType(file.type);
      cropImage(file, async (croppedBlob) => {
        await uploadImage
          .mutateAsync({ userId, fileType: croppedBlob.type })
          .then(async (url) => {
            if (url) {
              await axios.put(url, croppedBlob).then(async () => {
                const { data: res } = await refetchPicture();
                await updateUser.mutateAsync({
                  userId,
                  image: res,
                });
                await refetchUser();
              });
            }
          });
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
              refetchDocuments();
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

  const formRef = useRef<HTMLFormElement>(null);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserLayout
      className="m-20"
      sidePanel={
        <>
          <div className="relative h-40 w-40">
            <div className="relative h-full w-full overflow-hidden rounded-full shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image || "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-full w-full overflow-hidden rounded-full"
              />
            </div>
            <button className="absolute left-0 top-0 flex h-full w-full items-end justify-center rounded-full opacity-0 transition-all hover:opacity-100">
              <span className=" translate-y-[50%]">
                <FileInput onChange={handleUploadImg}>Edit</FileInput>
              </span>
            </button>
          </div>
          <div className="flex gap-4">
            <Button theme="danger" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={() => formRef.current?.requestSubmit()}>
              Submit
            </Button>
          </div>
        </>
      }
      mainPanel={
        <UserForm
          ref={formRef}
          user={user}
          onDocsUpload={handleUploadDocs}
          onDocDelete={handleDeleteDoc}
          documents={documents}
          onSubmit={handleSubmit}
        />
      }
    />
  );
}
