import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const ContractCard = ({
  rentCost,
  utilitiesCost,
  startDate,
  endDate,
  deleteLease,
  updateLease,
}: {
  rentCost: number;
  utilitiesCost: number;
  startDate: Date;
  endDate: Date;
  deleteLease: () => void;
  updateLease: () => void;
}) => {
  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString()
    : "";
  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : "";

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
          className="h-28 w-full"
        />
        <View className="w-full flex-col items-center justify-center p-4">
          <View className="mb-3">
            <View className="flex flex-row justify-between">
              <Text className="mr-10 text-base font-bold">Rent:</Text>
              <Text className="text-base">{rentCost}$</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="mr-10 text-base font-bold">Utilities:</Text>
              <Text className="text-base">{utilitiesCost}$</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="mr-10 text-base font-bold">Start:</Text>
              <Text className="text-base">{formattedStartDate}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="mr-10 text-base font-bold">End:</Text>
              <Text className="text-base">{formattedEndDate}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={updateLease}
          className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
        >
          <Text className="ml-4 text-base">Counter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteLease}
          className="flex w-full flex-row items-center justify-center border-b border-gray-300 px-4 py-2"
        >
          <Text className="ml-4 text-base">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContractCard;
