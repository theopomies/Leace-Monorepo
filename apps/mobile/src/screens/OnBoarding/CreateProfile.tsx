import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Btn } from "../../components/Btn";
import {
  DocumentPickerAsset,
  getDocumentAsync,
  DocumentPickerResult,
} from "expo-document-picker";
import Toast from "react-native-toast-message";
import { Icon } from "react-native-elements";
import { IAccountState, IStep } from "../../types/onboarding";
import { trpc } from "../../utils/trpc";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Buffer } from "buffer";

export default function CreateProfile({
  userId,
  setStep,
  setProgress,
  account,
  setAccount,
}: IStep & IAccountState) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<DocumentPickerAsset>();
  const [loading, setLoading] = useState({
    status: false,
    message: "Next",
  });
  const userProfile = trpc.user.updateUserById.useMutation({
    onSuccess() {
      setLoading({
        status: false,
        message: "Next",
      });
      if (account.role === "TENANT") {
        setProgress(66);
        setStep("PREFERENCES_COMPLETION");
      } else {
        setProgress(75);
        setStep("DOCUMENTS_COMPLETION");
      }
    },
    onError() {
      Toast.show({
        type: "error",
        text1: "This phone number is already in use.",
        text2: "Please choose a different number",
      });
      setLoading({ status: false, message: "Next" });
    },
  });

  const imageMutation = trpc.image.putSignedUrl.useMutation();
  const { refetch: refetchPicture } = trpc.image.getSignedUserUrl.useQuery(
    {
      userId,
      fileType: profile?.mimeType ?? "",
    },
    { enabled: false },
  );

  async function pickImage() {
    try {
      const picked: DocumentPickerResult = await getDocumentAsync({
        type: ["image/jpeg", "image/png"],
        multiple: false,
      });
      if (!picked) throw new Error("Could not pick an image");
      if (picked.canceled) return;
      const [image] = picked.assets;
      if (!image) throw new Error("Could not pick an image");
      setProfile(image);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Could not pick your image",
      });
    }
  }

  function isAdult() {
    const eighteenYearsAgo = new Date();
    const currentDate = new Date();
    eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);
    return account.birthDate < eighteenYearsAgo;
  }

  function validate() {
    if (
      !(
        account.firstName &&
        account.lastName &&
        account.phoneNumber &&
        account.description
      )
    )
      return setShow(true);
    if (!isAdult()) return setShow(true);
    setLoading({
      status: true,
      message: "Creating account...",
    });
    if (!profile) {
      userProfile.mutate({
        userId,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        description: account.description,
        birthDate: account.birthDate,
      });
      return;
    }
    imageMutation
      .mutateAsync({ userId, fileType: profile?.mimeType ?? "" })
      .then(async (url) => {
        if (!url || !profile) return;
        const imageContent = await FileSystem.readAsStringAsync(profile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const buffer = Buffer.from(imageContent, "base64");
        await axios({
          method: "PUT",
          url: url,
          data: buffer,
          headers: { "Content-Type": profile.mimeType },
        })
          .then(async () => {
            const { data: res } = await refetchPicture();
            await userProfile.mutateAsync({
              image: res,
              userId,
              firstName: account.firstName,
              lastName: account.lastName,
              phoneNumber: account.phoneNumber,
              description: account.description,
              birthDate: account.birthDate,
            });
          })
          .catch((e) => console.error(e));
      });
  }

  return (
    <>
      <DateTimePickerModal
        isVisible={open}
        date={account.birthDate}
        mode={"date"}
        onConfirm={(date) => {
          setOpen(false);
          setAccount((a) => ({ ...a, birthDate: date }));
        }}
        onCancel={() => setOpen(false)}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex h-40 flex-col justify-center px-8">
          <Text className="text-3xl font-bold">Tell us</Text>
          <Text className="text-3xl font-bold">more about you</Text>
        </View>
        <View className="flex h-28 items-center justify-center">
          <TouchableOpacity className="h-28 w-28" onPress={pickImage}>
            {profile ? (
              <Image
                className="h-full w-full rounded-full object-cover"
                source={{
                  uri: profile.uri,
                }}
              />
            ) : (
              <>
                {account.image ? (
                  <Image
                    className="h-full w-full rounded-full object-cover"
                    source={{
                      uri: account.image,
                    }}
                  />
                ) : (
                  <View className="flex h-full items-center justify-center rounded-full border border-[#6366f1]">
                    <Icon
                      name="add-a-photo"
                      type="material-icons"
                      color="#6366f1"
                    />
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-8">
          <View className="flex flex-col gap-3">
            <View className="flex flex-col gap-1">
              <Text>First Name</Text>
              <View className="relative">
                <TextInput
                  className="border-indigo h-9 rounded-lg border pl-2"
                  value={account.firstName}
                  onChangeText={(text) =>
                    setAccount((a) => ({ ...a, firstName: text }))
                  }
                ></TextInput>
                {!account.firstName && show && (
                  <Text
                    className="text-light-red absolute -bottom-3"
                    style={{ fontSize: 10 }}
                  >
                    Required field.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-1">
              <Text>Last Name</Text>
              <View className="relative">
                <TextInput
                  className="border-indigo h-9 rounded-lg border pl-2"
                  value={account.lastName}
                  onChangeText={(text) =>
                    setAccount((a) => ({ ...a, lastName: text }))
                  }
                ></TextInput>
                {!account.lastName && show && (
                  <Text
                    className="text-light-red absolute -bottom-3"
                    style={{ fontSize: 10 }}
                  >
                    Required field.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-1">
              <Text>Birthdate</Text>
              <View className="relative">
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <Text className="border-indigo h-9 rounded-lg border pl-2 leading-9">
                    {account.birthDate.toLocaleDateString()}
                  </Text>
                  {!isAdult() && show && (
                    <Text
                      className="text-light-red absolute -bottom-3"
                      style={{ fontSize: 10 }}
                    >
                      You must be 18 years old.
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-col gap-1">
              <Text>Phone Number</Text>
              <View className="relative">
                <TextInput
                  className="border-indigo h-9 rounded-lg border pl-2"
                  value={account.phoneNumber}
                  inputMode="tel"
                  onChangeText={(text) =>
                    setAccount((a) => ({ ...a, phoneNumber: text }))
                  }
                ></TextInput>
                {!account.phoneNumber && show && (
                  <Text
                    className="text-light-red absolute -bottom-3"
                    style={{ fontSize: 10 }}
                  >
                    Required field.
                  </Text>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-1">
              <Text>Description</Text>
              <TextInput
                className="border-indigo rounded-lg border pl-2"
                multiline
                numberOfLines={4}
                value={account.description}
                onChangeText={(text) =>
                  setAccount((a) => ({ ...a, description: text }))
                }
              ></TextInput>
              {!account.description && show && (
                <Text
                  className="text-light-red absolute -bottom-3"
                  style={{ fontSize: 10 }}
                >
                  Required field.
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className="flex flex-row justify-between px-8 pb-4 pt-2">
          <Btn
            title="Back"
            onPress={() => {
              setProgress(25);
              setStep("ROLE_SELECTION");
            }}
          />
          <Btn
            title={loading.message}
            onPress={!loading.status ? validate : undefined}
            spinner={loading.status}
          />
        </View>
      </ScrollView>
    </>
  );
}
