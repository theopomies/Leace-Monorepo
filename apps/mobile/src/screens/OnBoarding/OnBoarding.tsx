import { View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Welcome from "./Welcome";
import { Role, Step } from "../../types/onboarding";
import SelectRole from "./SelectRole";
import CreateProfile from "./CreateProfile";
import Toast from "react-native-toast-message";
import ChooseAttributes from "./ChooseAttributes";
import { trpc } from "../../utils/trpc";

export default function OnBoarding() {
  const [step, setStep] = useState<Step>("WELCOME");
  const [selectedRole, setSelectedRole] = useState<Role>("TENANT");
  const [process, setProgress] = useState(25);
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
        {step === "SELECT" && (
          <SelectRole
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        )}
        {step === "PROFILE" && (
          <CreateProfile
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
            selectedRole={selectedRole}
          />
        )}
        {step === "ATTRIBUTES" && (
          <ChooseAttributes
            setStep={setStep}
            setProgress={setProgress}
            userId={userId}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
}
