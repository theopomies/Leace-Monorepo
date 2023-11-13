import { View, Image } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={require("../../../assets/logo.png")} alt="leace-logo" />
    </View>
  );
}
