import { View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Welcome from "./Welcome";
import { Step } from "../../types/onboarding";
import SelectRole from "./SelectRole";
import CreateProfile from "./CreateProfile";
import Toast from "react-native-toast-message";
import ChooseAttributes from "./ChooseAttributes";

export default function OnBoarding() {
  const [step, setStep] = useState<Step>("WELCOME");
  const [process, setProgress] = useState(25);
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
          <Welcome step={step} setStep={setStep} setProgress={setProgress} />
        )}
        {step === "SELECT" && (
          <SelectRole step={step} setStep={setStep} setProgress={setProgress} />
        )}
        {step === "PROFILE" && (
          <CreateProfile
            step={step}
            setStep={setStep}
            setProgress={setProgress}
          />
        )}
        {step === "ATTRIBUTES" && (
          <ChooseAttributes
            step={step}
            setStep={setStep}
            setProgress={setProgress}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
}
