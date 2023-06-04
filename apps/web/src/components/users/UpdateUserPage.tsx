/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler } from "react";
import { trpc } from "../../utils/trpc";
import { Role } from "@prisma/client";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import axios from "axios";
import { UserForm, UserFormData } from "../shared/user/UserForm";

export interface UpdateUserPageProps {
  userId: string;
}

export function UpdateUserPage({ userId }: UpdateUserPageProps) {
  const router = useRouter();
  const { data: user } = trpc.user.getUserById.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const updateAttributes = trpc.attribute.updateUserAttributes.useMutation();

  const { data: documentsGet, refetch: refetchDocumentsGet } =
    trpc.document.getSignedUrl.useQuery({ userId });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const deleteDocument = trpc.document.deleteSignedUrl.useMutation();

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
    router.push(`/users/${userId}`);
  };

  const handleUploadDocs = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      Array.from(event.target.files).map(async (document) => {
        await uploadDocument
          .mutateAsync({
            userId,
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
        OnDocsUpload={handleUploadDocs}
        OnDocDelete={handleDeleteDoc}
        documentsGet={documentsGet}
        OnSubmit={handleSubmit}
        OnCancel={handleCancel}
      />
    </div>
  );
}
