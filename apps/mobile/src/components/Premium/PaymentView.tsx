import { useStripe, CardField } from "@stripe/stripe-react-native";
import React from "react";
import { View, Text } from "react-native";
import { trpc } from "../../utils/trpc";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { Button } from "react-native-elements";

const PaymentView = ({
  amount,
  product,
}: {
  amount: number;
  product: string;
}) => {
  const { confirmPayment } = useStripe();

  const { data: session } = trpc.auth.getSession.useQuery();

  const user = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const payment = trpc.stripe.createPayment.useQuery({
    amount: Math.round(amount * 100),
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const handleConfirmation = async () => {
    if (payment.data?.paymentIntent) {
      try {
        const { paymentIntent, error } = await confirmPayment(
          payment.data.paymentIntent as string,
          {
            paymentMethodType: "Card",
            paymentMethodData: {
              billingDetails: {
                email: user.data?.email as string,
              },
            },
          },
        );

        if (!error) {
          navigation.navigate("PaymentResults", {
            isValidPayment: true,
            paymentIntent,
            amount,
            product,
          });
        } else {
          navigation.navigate("PaymentResults", {
            isValidPayment: false,
            paymentIntent,
            amount,
            product,
          });
        }
      } catch (error) {
        console.error("Error in payment confirmation:", error);
        // Handle errors appropriately
      }
    }
  };
  return (
    <View className="mt-5 flex h-full w-full flex-col items-center">
      <Text className="mb-5 text-4xl font-bold text-indigo-500">€{amount}</Text>
      <Text className="mb-20 text-2xl font-bold">{product}</Text>

      <View className=" item-center w-5/6">
        <Text className="mb-4 text-2xl font-bold">Card information</Text>

        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            borderColor: "#000000",
            borderWidth: 1,
          }}
          style={{
            height: 100,
            marginVertical: 30,
          }}
        />
      </View>
      <View className="mt-20">
        <Button
          title="Pay"
          icon={{
            name: "lock",
            type: "font-awesome",
            size: 15,
            color: "white",
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "#6466f1",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 15,
          }}
          containerStyle={{
            width: 150,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={handleConfirmation}
        />
      </View>
    </View>
  );
};

export default PaymentView;
