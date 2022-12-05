import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomInput from "../../components/CustomInput/CustomInput";

export const ConnexionScreen = () => {
    return (
      <SafeAreaView>
        <View>
          <Text className="mt-[80] text-center text-8xl font-bold tracking-tight text-gray-900">Welcome to Leace</Text>
        </View>
        <View>
          <Text className="mt-[20] text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</Text>
        </View>
        <View>
          <CustomInput />
          <Text className="mt-7 text-center">hello</Text>
        </View>
      </SafeAreaView>
    );
  };