import React from "react";
import { Btn } from "../Btn";
import { View, Image } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function Loading({ signOut }: { signOut?: boolean }) {
  const { signOut: disconnect } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={require("../../../assets/logo.png")} alt="leace-logo" />
      {signOut && (
        <Btn
          title="Sign Out"
          onPress={() => disconnect()}
          iconName="logout"
          iconType="material-icons"
        ></Btn>
      )}
    </View>
  );
}
