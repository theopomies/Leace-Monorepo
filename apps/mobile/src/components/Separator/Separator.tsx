import { View, Text } from "react-native";
import React from "react";

export default function Separator({ color = "white" }: { color?: string }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: color,
        opacity: 0.5,
        marginVertical: 10,
      }}
    ></View>
  );
}
