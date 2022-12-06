import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

// import CustomInput from "../../components/CustomInput/CustomInput";

export type NavigationParamList = {

}


export const ConnexionScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>("");

  const OnSignPressed = () => {
    navigation.navigate("Main");
  };

  return (
    <ScrollView>
      <View>
        <Text className="mt-[90] text-center text-8xl font-bold tracking-tight text-gray-900">
          Welcome to Leace
        </Text>
        <Text className="mt-[20] text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </Text>

        <View>
          <Input
            className="mx-3 mt-[40] pt-0"
            placeholder="email *"
            autoCompleteType={undefined}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Button
            className="mx-9 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700"
            title="Log In / Sign up"
            onPress={OnSignPressed}
          />

          <Text className="mt-7 text-center">or</Text>
        </View>
      </View>
    </ScrollView>
  );
};
