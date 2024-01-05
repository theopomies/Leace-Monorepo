import { View, Text } from "react-native";
import React from "react";
import { Btn } from "../../components/Btn";
import { IStep } from "../../types/onboarding";
import { trpc } from "../../utils/trpc";

export default function Welcome({ setStep, setProgress }: IStep) {
  const createUser = trpc.user.createUser.useMutation();

  return (
    <>
      <View className="flex h-40 flex-col justify-center px-8">
        <Text className="text-3xl font-bold">Welcome on</Text>
        <Text className="text-3xl font-bold">Leace</Text>
      </View>
      <View className="flex flex-1 flex-col justify-around px-8">
        <View className="flex h-full max-h-60 flex-col justify-between gap-4">
          <Text className="font-medium">
            To ensure the safest and most pleasant experience on Leace, we
            require each user to have a minimally complete profile.
          </Text>
          <Text className="font-medium">
            Before we can create your account you will have to go through a
            small bootstrapping process, don't worry, this won't take more that
            a few minutes, and you can leave and come back right where you left.
          </Text>
        </View>
        <View>
          <Btn
            title="Perfect, lets create my account"
            onPress={() => {
              setProgress(25);
              setStep("ROLE_SELECTION");
              createUser.mutate();
            }}
          />
        </View>
      </View>
    </>
  );
}
