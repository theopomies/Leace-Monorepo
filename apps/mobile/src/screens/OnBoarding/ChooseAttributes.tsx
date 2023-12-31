import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { IStep } from "../../types/onboarding";
import { IUserAttrs } from "../../types";
import { EditAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";
import { trpc } from "../../utils/trpc";
import EditAttributesRefacto from "../../components/Attribute/EditAttributesRefacto";
export default function ChooseAttributes({
  userId,
  setStep,
  setProgress,
}: IStep) {
  const [attrs, setAttrs] = useState<IUserAttrs | undefined>({ userId });
  const utils = trpc.useContext();
  const userAttributes = trpc.attribute.updateUserAttributes.useMutation({
    onSuccess() {
      utils.user.getUserById.invalidate();
    },
  });

  return (
    <>
      <ScrollView>

        <View className="flex h-40 flex-col justify-center px-8">
          <Text className="text-3xl font-bold">
            One last thing, tell us what you are looking for!
          </Text>
        </View>
        <View className="flex-1 px-8 pb-4">
          <EditAttributesRefacto userId={"userId"} attrs={attrs} setAttrs={setAttrs} onBoarding={true} />
        </View>
        <View className="flex flex-row justify-between px-8 pb-4">
          <Btn
            title="Back"
            bgColor="#6C47FF"
            onPress={() => {
              setProgress(50);
              setStep("PROFILE");
            }}
          />
          <Btn
            title="Finish setting me up"
            bgColor="#6C47FF"
            onPress={() => {
              if (!attrs?.homeType)
                attrs!.homeType = "HOUSE"
              userAttributes.mutate({
                userId,
                ...attrs,
              });
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}
