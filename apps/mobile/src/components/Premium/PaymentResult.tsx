import React, { useEffect } from "react";
import { Animated, View, TouchableOpacity, Image, Text } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentResult = ({
  isValidPayment,
  email,
  amount,
  product,
  firstName,
  lastName,
  updateStatus,
}: {
  isValidPayment: boolean;
  email: string | null | undefined;
  amount: number | null | undefined;
  product: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  userId: string;
  updateStatus: () => void;
}) => {
  const checkmarkScale = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(checkmarkScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isValidPayment) {
      const delay = setTimeout(() => {
        updateStatus();
      }, 50000);

      return () => clearTimeout(delay);
    }
  }, [isValidPayment]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center overflow-hidden bg-white">
        <Image
          source={require("../../../assets/logo_1024.png")}
          className="h-28 w-28"
        />
      </View>
      <View className={"items-center justify-center"}>
        <View className=" w-full rounded bg-white p-6 ">
          <View className={"items-center justify-center"}>
            <View
              className={`h-16 w-16 items-center justify-center rounded-full ${
                isValidPayment ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <Icon name="check" type="material" color="white" size={30} />
            </View>
            <Text
              className={`mt-2 text-center text-xl font-bold ${
                isValidPayment ? "text-green-500" : "text-red-500"
              }`}
            >
              {isValidPayment ? "Payment successful!" : "Payment failed!"}
            </Text>
            <View className="my-20 w-full space-y-5">
              <View className="mx-8 flex-row justify-between">
                <Text className={"text-base font-bold"}>Name</Text>
                <Text className={"text-base"}>
                  {firstName} {lastName}
                </Text>
              </View>
              <View className="mx-8 flex-row justify-between">
                <Text className={"text-base font-bold"}>Email</Text>
                <Text className={"text-base"}>{email}</Text>
              </View>
              <View className="mx-8 flex-row justify-between">
                <Text className={"text-base font-bold"}>Product</Text>
                <Text className={"text-base"}>{product}</Text>
              </View>
              <View className="mx-8 flex-row justify-between">
                <Text className={"text-base font-bold"}>Amount paid</Text>
                <Text className={"text-base"}>{amount}€</Text>
              </View>
            </View>
            <View className="mt-4 flex-row space-x-2">
              <TouchableOpacity
                className={"bg-indigo w-24 rounded p-2"}
                onPress={() => {
                  updateStatus();
                }}
              >
                <Text className={"text-center text-base font-bold text-white"}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentResult;
