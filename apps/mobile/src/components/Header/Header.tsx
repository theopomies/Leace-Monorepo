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
      <View
        className={`h-12 ${
          Platform.OS === "android" ? "w-12" : "w-18"
        } items-center justify-center overflow-hidden`}
      >
        <Image
          className="block h-14 w-14"
          source={require("../../../assets/logo_1024.png")}
        ></Image>
      </View>
    </GestureRecognizer>
  );
}
