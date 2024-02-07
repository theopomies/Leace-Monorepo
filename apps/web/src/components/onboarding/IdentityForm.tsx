import { ChangeEvent, useEffect, useState } from "react";
import { DateInput } from "../shared/forms/DateInput";
import { TextInput } from "../shared/forms/TextInput";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { TextArea } from "../shared/forms/TextArea";
import { Button } from "../shared/button/Button";
import { cropImage } from "../../utils/cropImage";
import axios from "axios";
import { UserImage } from "../shared/user/UserImage";
import { FileInput } from "../shared/forms/FileInput";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";

export function IdentityForm({ userId }: { userId: string }) {
  const { renderToast } = useToast();
  const utils = trpc.useContext();
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = trpc.user.getUserById.useQuery({ userId });
  const updateUser = trpc.user.updateUserById.useMutation();

  const [userInfo, setUserInfo] = useState<{
    firstName?: string;
    lastName?: string;
    description?: string;
    birthDate?: string;
  }>({
    firstName: undefined,
    lastName: undefined,
    description: undefined,
    birthDate: undefined,
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        description: user.description || undefined,
        birthDate: user.birthDate?.toISOString().split("T")[0] || undefined,
      });
    }
  }, [user]);

  const [fileType, setFileType] = useState("");
  const uploadImage = trpc.image.putSignedUrl.useMutation();
  const { refetch: refetchPicture } = trpc.image.getSignedUserUrl.useQuery(
    {
      userId,
      fileType,
    },
    { enabled: false },
  );

  const handleUploadImg = (file: File | undefined) => {
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

  const [selectedImage, setSelectedImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0] as File;
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const preview = e.target.result as string;
          setImagePreview(preview);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage && !user?.image) {
      renderToast(
        <>
          <ToastTitle>Missing Profile Picture</ToastTitle>
          <ToastDescription>Please upload a picture</ToastDescription>
        </>,
      );
      return;
    }
    try {
      await updateUser.mutateAsync({
        userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        description: userInfo.description,
        birthDate: new Date(userInfo.birthDate + "T00:00:00.000Z"),
      });
      handleUploadImg(selectedImage);
      utils.onboarding.getUserOnboardingStatus.invalidate();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      renderToast(
        <>
          <ToastTitle>Oops, something went wrong</ToastTitle>
          <ToastDescription>
            {e.message ?? "Please try again later"}
          </ToastDescription>
        </>,
      );
    }
  };

  if (isLoading) return <Loader />;
  if (!user) throw new Error("User not found");

  return (
    <>
      <div className="h-2 w-[50%] bg-indigo-500" />
      <div className="mx-64 flex flex-grow flex-col gap-24 text-lg">
        <h1 className="mt-40 text-center text-4xl">Tell us more about you</h1>
        <div className="flex justify-center">
          <div className="relative h-40 w-40">
            <div className="relative h-full w-full overflow-hidden rounded-full shadow-xl">
              <UserImage user={user} imagePreview={imagePreview} />
            </div>
            <button className="absolute left-0 top-0 flex h-full w-full items-end justify-center rounded-full opacity-0 transition-all hover:opacity-100">
              <span className="translate-y-[50%]">
                <FileInput onChange={handleFile}>Edit</FileInput>
              </span>
            </button>
          </div>
        </div>
        <form
          className="flex flex-col items-center gap-8"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-grow flex-wrap gap-12">
            <div className="flex-grow">
              <label>
                <h3 className="pb-2 text-xl font-medium">First name</h3>
                <TextInput
                  required
                  placeholder="Jean"
                  onChange={(e) => {
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      firstName: e.target.value,
                    }));
                  }}
                  value={userInfo.firstName}
                  className="w-full"
                />
              </label>
            </div>
            <div className="flex-grow">
              <label>
                <h3 className="pb-2 text-xl font-medium">Last name</h3>
                <TextInput
                  required
                  placeholder="Dupont"
                  onChange={(e) => {
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      lastName: e.target.value,
                    }));
                  }}
                  value={userInfo.lastName}
                  className="w-full"
                />
              </label>
            </div>
            <div className="flex-grow">
              <label>
                <h3 className="pb-2 text-xl font-medium">Birthdate</h3>

                <DateInput
                  required
                  onChange={(e) => {
                    setUserInfo((userInfo) => ({
                      ...userInfo,
                      birthDate: e.target.value,
                    }));
                  }}
                  value={userInfo.birthDate}
                  className="w-full"
                  // minus 18 years
                  max={
                    new Date(
                      new Date().getFullYear() - 18,
                      new Date().getMonth(),
                      new Date().getDate(),
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  min="1900-01-01"
                />
              </label>
            </div>
          </div>
          <div className="w-full">
            <label>
              <h3 className="pb-2 text-xl font-medium">Description</h3>
              <TextArea
                required
                placeholder="Fashionista and tech enthusiast. I'm the perfect tenant for your apartment! 💁🏻‍♀️"
                onChange={(e) => {
                  setUserInfo((userInfo) => ({
                    ...userInfo,
                    description: e.target.value,
                  }));
                }}
                value={userInfo.description}
                className="w-full"
              />
            </label>
          </div>
          <div className="flex w-full justify-end pr-12">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </div>
    </>
  );
}
