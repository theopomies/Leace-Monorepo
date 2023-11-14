import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Animated, View, TouchableOpacity, Image, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TabStackParamList } from "../../navigation/RootNavigator";

const PaymentResult = ({
  isValidPayment,
  email,
  amount,
  firstName,
  lastName,
  updateStatus,
}: {
  isValidPayment: boolean;
  email: string | null | undefined;
  amount: number | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  updateStatus: () => void;
}) => {
  const checkmarkScale = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(checkmarkScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <View>
      <View className="items-center justify-center">
        <Image
          source={require("../../../assets/logo_1024.png")}
          className="h-40 w-40"
        />
      </View>
      <View className={"items-center justify-center"}>
        {isValidPayment ? (
          <View className="my-4 w-full max-w-md rounded bg-white p-6 shadow-lg">
            <View className={"items-center justify-center"}>
              <View
                className={`h-16 w-16 items-center justify-center rounded-full ${
                  isValidPayment ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {isValidPayment ? (
                  <Icon name="check" type="material" color="white" size={30} />
                ) : (
                  <Icon name="close" type="material" color="white" size={30} />
                )}
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
                  <Text className={"text-base font-bold"}>Amount paid</Text>
                  <Text className={"text-base"}>{amount}€</Text>
                </View>
              </View>
              <View className="mt-4 flex-row space-x-2">
                <TouchableOpacity
                  className={"w-24 rounded bg-blue-400 p-2"}
                  onPress={() => {
                    updateStatus();
                    navigation.navigate("Likes");
                  }}
                >
                  <Text
                    className={"text-center text-base font-bold text-white"}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="my-4 w-full max-w-md rounded bg-white p-6 shadow-lg">
            <View className={"items-center justify-center"}>
              <View
                className={`h-16 w-16 items-center justify-center rounded-full bg-red-500`}
              >
                <Icon name="close" type="material" color="white" size={30} />
              </View>
              <Text
                className={`mt-2 text-center text-xl font-bold text-red-500`}
              >
                Payment failed!
              </Text>
              <View className="my-8 text-center">
                <Text className="text-base font-bold">
                  Oops! Something went wrong.
                </Text>
                <Text className="mt-5 text-base">
                  We're sorry, but the payment could not be processed at this
                  time.
                </Text>
                <Text className="mt-2 text-base">
                  Possible reasons for failure:
                </Text>
                <Text className="text-base">
                  - Insufficient funds on the card
                </Text>
                <Text className="text-base">
                  - Expired or invalid card details
                </Text>
              </View>
              <View className="mt-4 flex-row space-x-20">
                <TouchableOpacity
                  className={"w-24 rounded bg-blue-400 p-2"}
                  onPress={() => {
                    navigation.navigate("Premium");
                  }}
                >
                  <Text
                    className={"text-center text-base font-bold text-white"}
                  >
                    Retry
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={"w-24 rounded bg-blue-400 p-2"}
                  onPress={() => {
                    navigation.navigate("Premium");
                  }}
                >
                  <Text
                    className={"text-center text-base font-bold text-white"}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentResult;
