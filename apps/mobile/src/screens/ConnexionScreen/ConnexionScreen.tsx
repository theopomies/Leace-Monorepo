import React from "react";

import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export const ConnexionScreen = () => {
    return (
      <SafeAreaView>
        <View>
          {/* <Text className="font-semibold italic text-black">Leace Home</Text> */}
          <Text className={`text-center py-5 text-xl`}>Welcome back</Text>
        </View>
      </SafeAreaView>
    );
  };