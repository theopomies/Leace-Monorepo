import { View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Welcome from "./Welcome";
import SelectRole from "./SelectRole";
import CreateProfile from "./CreateProfile";
import Toast from "react-native-toast-message";
import ChooseAttributes from "./ChooseAttributes";
import { trpc } from "../../utils/trpc";
import { OnboardingStatus } from "@leace/api/src/utils/types";
import UploadDocuments from "./UploadDocuments";
import { Role } from "@leace/db";

export default function OnBoarding({
  apiStep,
  role,
}: {
  apiStep?: OnboardingStatus;
  role?: Role;
}) {
  const [step, setStep] = useState<OnboardingStatus | "WELCOME">(
    apiStep ? apiStep : "WELCOME",
  );
  const [process, setProgress] = useState(0);
  const utils = trpc.useContext();
  const data = utils.auth.getSession.getData();
  const userId = data?.userId || "";
  const [account, setAccount] = useState<{
    role: Role;
    firstName: string;
    lastName: string;
    image: string;
    phoneNumber: string;
    description: string;
    birthDate: Date;
  }>({
    role: role ?? "TENANT",
    firstName: "",
    lastName: "",
    image: "",
    phoneNumber: "",
    description: "",
    birthDate: new Date(),
  });
  const { refetch, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId },
    {
      enabled: !!userId,
      onSuccess(data) {
        setAccount({
          role: data.role ?? "TENANT",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          image: data.image ?? "",
          phoneNumber: data.phoneNumber ?? "",
          description: data.description ?? "",
          birthDate: data.birthDate ?? new Date(),
        });
      },
    },
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <View className="h-1">
          <View
            className="bg-indigo h-1"
            style={{ width: `${process}%` }}
          ></View>
        </View>
        {step === "WELCOME" && (
          <Welcome
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            callback={refetch}
          />
        )}
        {step === "ROLE_SELECTION" && (
          <SelectRole
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            account={account}
            setAccount={setAccount}
          />
        )}
        {step === "IDENTITY_COMPLETION" && (
          <CreateProfile
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            account={account}
            setAccount={setAccount}
            userLoading={userLoading}
          />
        )}
        {step === "PREFERENCES_COMPLETION" && (
          <ChooseAttributes
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
          />
        )}
        {step === "DOCUMENTS_COMPLETION" && (
          <UploadDocuments
            userId={userId}
            account={account}
            setAccount={setAccount}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
}
