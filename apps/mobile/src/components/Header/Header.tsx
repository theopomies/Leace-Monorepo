import React from "react";
import { View, Image, Platform } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

export default function Header({ callback }: { callback?: () => void }) {
  return (
    <GestureRecognizer
      style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}
      className="z-10 flex h-[49px] items-center justify-center"
      onSwipeDown={() => {
        if (!callback) return;
        callback();
      }}
    >
      <View className="h-12 w-12 items-center justify-center overflow-hidden bg-red-500">
        <Image
          className="h-full w-full"
          source={require("../../../assets/logo_1024.png")}
        ></Image>
      </View>
    </GestureRecognizer>
  );
}
