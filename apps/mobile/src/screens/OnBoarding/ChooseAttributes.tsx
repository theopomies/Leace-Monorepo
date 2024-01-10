import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { IStep } from "../../types/onboarding";
import { IUserAttrs } from "../../types";
import { Btn } from "../../components/Btn";
import { trpc } from "../../utils/trpc";
import EditAttributesRefacto from "../../components/Attribute/EditAttributesRefacto";

export default function ChooseAttributes({
  userId,
  setStep,
  setProgress,
}: IStep) {
  const [attrs, setAttrs] = useState<IUserAttrs | undefined>({ userId });
  const userAttributes = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      setProgress(82);
      setStep("DOCUMENTS_COMPLETION");
    },
  });

  const [showLocationError, setShowLocationError] = useState(false);
  const [showMinPriceError, setShowMinPriceError] = useState(false);
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);
  const [showMinSizeError, setShowMinSizeError] = useState(false);
  const [showMaxSizeError, setShowMaxSizeError] = useState(false);

  const handleFinishSettingUp = () => {
    // Check for all errors and set the corresponding state variables
    if (!attrs?.location) {
      setShowLocationError(true);
    } else {
      setShowLocationError(false);
    }

    if (isNaN(attrs?.minPrice as number) || attrs?.minPrice === undefined) {
      setShowMinPriceError(true);
    } else {
      setShowMinPriceError(false);
    }

    if (isNaN(attrs?.maxPrice as number) || attrs?.maxPrice === undefined) {
      setShowMaxPriceError(true);
    } else {
      setShowMaxPriceError(false);
    }

    if (isNaN(attrs?.minSize as number) || attrs?.minSize === undefined) {
      setShowMinSizeError(true);
    } else {
      setShowMinSizeError(false);
    }

    if (isNaN(attrs?.maxSize as number) || attrs?.maxSize === undefined) {
      setShowMaxSizeError(true);
    } else {
      setShowMaxSizeError(false);
    }

    // If no errors, proceed with mutation
    if (
      !showLocationError &&
      !showMinPriceError &&
      !showMaxPriceError &&
      !showMinSizeError &&
      !showMaxSizeError
    ) {
      userAttributes.mutate({ userId, ...attrs });
    }
  };

  return (
    <>
      <ScrollView>
        <View className="flex h-40 flex-col justify-center px-8">
          <Text className="text-3xl font-bold">
            One last thing, tell us what you are looking for!
          </Text>
        </View>
        <View className="flex-1 px-8 pb-4">
          <EditAttributesRefacto
            userId={"userId"}
            attrs={attrs}
            setAttrs={setAttrs}
            onBoarding={true}
            showErrorCallback={showLocationError}
            showMinPriceErrorCallback={showMinPriceError}
            showMaxPriceErrorCallback={showMaxPriceError}
            showMinSizeErrorCallback={showMinSizeError}
            showMaxSizeErrorCallback={showMaxSizeError}
          />
        </View>
        <View className="flex flex-row justify-between px-8 pb-4">
          <Btn
            title="Back"
            bgColor="#6C47FF"
            onPress={() => {
              setProgress(50);
              setStep("IDENTITY_COMPLETION");
            }}
          />
          <Btn
            title="Finish setting me up"
            bgColor="#6C47FF"
            onPress={() => {
              if (!attrs?.homeType) attrs!.homeType = "HOUSE";
              handleFinishSettingUp();
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}
