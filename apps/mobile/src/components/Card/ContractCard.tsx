import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const ContractCard = () => {
  return (
    <View className="mt-5 flex items-center justify-center">
      <View className="w-5/6 overflow-hidden rounded-xl border border-gray-400">
        <View className="flex-row items-center p-4">
          <Image
            source={require("../../../assets/logo.png")}
            className="mr-2 h-10 w-10"
          />
          <Text className="text-lg font-bold">Contract</Text>
        </View>
        <Image
          source={require("../../../assets/appart.jpg")}
          className="h-48 w-full"
        />
        <View className="w-full flex-col items-center justify-center p-4">
          <TouchableOpacity
            className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
            onPress={() => {
              console.log("OK");
            }}
          >
            <Text className="ml-4 text-base">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
            onPress={() => {
              console.log("OK");
            }}
          >
            <Text className="ml-4 text-base">Counter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
            onPress={() => {
              console.log("OK");
            }}
          >
            <Text className="ml-4 text-base">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ContractCard;
