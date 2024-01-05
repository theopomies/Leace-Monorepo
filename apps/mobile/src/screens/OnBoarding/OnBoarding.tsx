import { View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Welcome from "./Welcome";
// import { Role } from "../../types/onboarding";
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
  const [selectedRole, setSelectedRole] = useState<Role>(role ?? "TENANT");
  const [process, setProgress] = useState(0);
  const utils = trpc.useContext();
  const data = utils.auth.getSession.getData();
  const userId = data?.userId || "";

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
          />
        )}
        {step === "ROLE_SELECTION" && (
          <SelectRole
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        )}
        {step === "IDENTITY_COMPLETION" && (
          <CreateProfile
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            selectedRole={selectedRole}
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
          <UploadDocuments userId={userId} selectedRole={selectedRole} />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
}
