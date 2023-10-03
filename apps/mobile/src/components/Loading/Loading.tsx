import { View, Platform, StatusBar, Image } from "react-native";
import React from "react";

export default function Loading() {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <Image source={require("../../../assets/logo.png")} alt="leace-logo" />
    </View>
  );
}
