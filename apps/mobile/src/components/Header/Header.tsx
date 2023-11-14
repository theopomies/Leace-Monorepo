import React from "react";
import { View, Image } from "react-native";

export default function Header() {
  return (
    <View
      style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}
      className="z-10 flex h-[49px] items-center justify-center"
    >
      <View className="h-12 w-12 items-center justify-center overflow-hidden">
        <Image
          className="block h-14 w-14"
          source={require("../../../assets/logo_1024.png")}
        ></Image>
      </View>
    </View>
  );
}
