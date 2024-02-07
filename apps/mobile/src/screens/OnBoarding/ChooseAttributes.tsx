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
  const [attrs, setAttrs] = useState<IUserAttrs | undefined>({
    userId,
    homeType: "HOUSE",
  });
  const userAttributes = trpc.attribute.updateUserAttributes.useMutation();

  const [showLocationError, setShowLocationError] = useState(false);
  const [showMinPriceError, setShowMinPriceError] = useState(false);
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);
  const [showMinSizeError, setShowMinSizeError] = useState(false);
  const [showMaxSizeError, setShowMaxSizeError] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showPriceError, setShowPriceError] = useState(false);
  const [showRentDateError, setShowRentDateError] = useState(false);

  const [showMinBedError, setShowMinBedError] = useState(false);
  const [showMaxBedError, setShowMaxBedError] = useState(false);
  const [showBedError, setShowBedError] = useState(false);

  const [showMinBathError, setShowMinBathError] = useState(false);
  const [showMaxBathError, setShowMaxBathError] = useState(false);
  const [showBathError, setShowBathError] = useState(false);

  const handleFinishSettingUp = async () => {
    let isValid = true;

    const currentDate = new Date();

    if (!attrs?.location) {
      isValid = false;
      setShowLocationError(true);
    } else {
      setShowLocationError(false);
    }

    if (
      attrs?.minPrice === undefined ||
      isNaN(attrs?.minPrice as number) ||
      attrs.minPrice <= 0
    ) {
      isValid = false;
      setShowMinPriceError(true);
    } else {
      setShowMinPriceError(false);
    }

    if (
      attrs?.maxPrice === undefined ||
      isNaN(attrs?.maxPrice as number) ||
      attrs.maxPrice <= 0
    ) {
      isValid = false;
      setShowMaxPriceError(true);
    } else {
      setShowMaxPriceError(false);
    }

    if (
      attrs?.minSize === undefined ||
      isNaN(attrs.minSize as number) ||
      attrs.minSize <= 0
    ) {
      isValid = false;
      setShowMinSizeError(true);
    } else {
      setShowMinSizeError(false);
    }

    if (
      attrs?.maxSize === undefined ||
      isNaN(attrs.maxSize as number) ||
      attrs.maxSize <= 0
    ) {
      isValid = false;
      setShowMaxSizeError(true);
    } else {
      setShowMaxSizeError(false);
    }

    if (
      attrs?.minBedrooms === undefined ||
      isNaN(attrs?.minBedrooms as number) ||
      attrs.minBedrooms <= 0
    ) {
      isValid = false;
      setShowMinBedError(true);
    } else {
      setShowMinBedError(false);
    }

    if (
      attrs?.maxBedrooms === undefined ||
      isNaN(attrs?.maxBedrooms as number) ||
      attrs.maxBedrooms <= 0
    ) {
      isValid = false;
      setShowMaxBedError(true);
    } else {
      setShowMaxBedError(false);
    }

    if (
      attrs?.minBathrooms === undefined ||
      isNaN(attrs?.minBathrooms as number) ||
      attrs.minBathrooms <= 0
    ) {
      isValid = false;
      setShowMinBathError(true);
    } else {
      setShowMinBathError(false);
    }

    if (
      attrs?.maxBathrooms === undefined ||
      isNaN(attrs?.maxBathrooms as number) ||
      attrs.maxBathrooms <= 0
    ) {
      isValid = false;
      setShowMaxBathError(true);
    } else {
      setShowMaxBathError(false);
    }

    if (
      attrs?.rentStartDate === undefined ||
      attrs?.rentEndDate === undefined ||
      attrs.rentStartDate < currentDate ||
      (attrs?.rentStartDate &&
        attrs?.rentEndDate &&
        attrs.rentStartDate.getTime() >= attrs.rentEndDate.getTime())
    ) {
      isValid = false;
      setShowRentDateError(true);
    } else {
      setShowRentDateError(false);
    }

    if (
      attrs?.minPrice !== undefined &&
      attrs?.maxPrice !== undefined &&
      attrs.minPrice >= attrs.maxPrice
    ) {
      isValid = false;
      setShowPriceError(true);
    } else {
      setShowPriceError(false);
    }

    if (
      attrs?.minSize !== undefined &&
      attrs?.maxSize !== undefined &&
      attrs.minSize >= attrs.maxSize
    ) {
      isValid = false;
      setShowSizeError(true);
    } else {
      setShowSizeError(false);
    }

    if (
      attrs?.minBedrooms !== undefined &&
      attrs?.maxBedrooms !== undefined &&
      attrs.minBedrooms >= attrs.maxBedrooms
    ) {
      isValid = false;
      setShowBedError(true);
    } else {
      setShowBedError(false);
    }

    if (
      attrs?.minBathrooms !== undefined &&
      attrs?.maxBathrooms !== undefined &&
      attrs.minBathrooms >= attrs.maxBathrooms
    ) {
      isValid = false;
      setShowBathError(true);
    } else {
      setShowBathError(false);
    }

    if (isValid) {
      userAttributes.mutate({ userId, ...attrs });

      setProgress(82);
      setStep("DOCUMENTS_COMPLETION");
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
            showPriceErrorCallback={showPriceError}
            showRentDateErrorCallback={showRentDateError}
            showSizeErrorCallback={showSizeError}
            showMinBedErrorCallback={showMinBedError}
            showMaxBedErrorCallback={showMaxBedError}
            showMinBathErrorCallback={showMinBathError}
            showMaxBathErrorCallback={showMaxBathError}
            showBedErrorCallback={showBedError}
            showBathErrorCallback={showBathError}
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
              if (!attrs?.homeType) attrs?.homeType === "HOUSE";
              handleFinishSettingUp();
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}
