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
import { IStep, Role } from "../../types/onboarding";
import { trpc } from "../../utils/trpc";

export default function CreateProfile({
  userId,
  setStep,
  setProgress,
  selectedRole,
}: IStep & { selectedRole: Role }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState<DocumentPickerAsset>();
  const utils = trpc.useContext();
  const userProfile = trpc.user.updateUserById.useMutation({
    onSuccess() {
      if (selectedRole === "TENANT") {
        setProgress(75);
        setStep("ATTRIBUTES");
      } else {
        utils.user.getUserById.invalidate();
      }
    },
  });

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
    return birthDate < eighteenYearsAgo;
  }

  function validate() {
    if (!(firstName && lastName && phoneNumber)) return setShow(true);
    if (!isAdult) return setShow(true);
    userProfile.mutate({
      userId,
      firstName,
      lastName,
      phoneNumber,
      description,
      birthDate,
    });
  }

  return (
    <>
      <DateTimePickerModal
        isVisible={open}
        date={birthDate}
        mode={"date"}
        onConfirm={(date) => {
          setOpen(false);
          setBirthDate(date);
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
              <View className="flex h-full items-center justify-center rounded-full border border-[#6366f1]">
                <Icon
                  name="add-a-photo"
                  type="material-icons"
                  color="#6366f1"
                />
              </View>
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
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                ></TextInput>
                {!firstName && show && (
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
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                ></TextInput>
                {!lastName && show && (
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
                    {birthDate.toLocaleDateString()}
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
                  value={phoneNumber}
                  inputMode="tel"
                  onChangeText={(text) => setPhoneNumber(text)}
                ></TextInput>
                {!phoneNumber && show && (
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
                value={description}
                onChangeText={(text) => setDescription(text)}
              ></TextInput>
            </View>
          </View>
        </View>
        <View className="flex flex-row justify-between px-8 pb-4 pt-2">
          <Btn
            title="Back"
            onPress={() => {
              setProgress(25);
              setStep("SELECT");
            }}
          />
          <Btn
            title={`${
              selectedRole === "TENANT" ? "Next" : "Finish setting me up"
            }`}
            onPress={validate}
          />
        </View>
      </ScrollView>
    </>
  );
}
