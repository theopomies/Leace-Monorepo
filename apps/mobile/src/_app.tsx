import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import React from "react";
import { Text, View } from "react-native";

LogBox.ignoreAllLogs(); //Ignore all log notifications

export const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};
