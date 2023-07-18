import { View } from "react-native";
import React from "react";

import { ActivityIndicator } from "react-native";

export const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={"#002642"} />
    </View>
  );
};
