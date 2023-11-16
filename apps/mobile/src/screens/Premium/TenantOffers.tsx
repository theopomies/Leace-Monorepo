import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { trpc } from "../../utils/trpc";
import { Icon } from "react-native-elements";
import { Loading } from "../../components/Loading";

interface Item {
  id: number;
  name: string;
  amount: number;
  period: string;
}

const TenantOffers = () => {
  const items: Item[] = [
    {
      id: 1,
      name: "1 Month",
      amount: 19.99,
      period: "Monthly",
    },
    {
      id: 2,
      name: "1 Year",
      amount: 199.99,
      period: "Yearly",
    },
  ];

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const initialSelectedProduct = items[0] || null;

  const [selectedProduct, setSelectedProduct] = useState<Item | null>(
    initialSelectedProduct,
  );

  const handleCardClick = (item: Item) => {
    setSelectedProduct(item);
  };

  const [paymentDataInitialized, setPaymentDataInitialized] = useState(false);

  const payment = trpc.stripe.createPayment.useQuery({
    amount: Math.round((selectedProduct?.amount as number) * 100),
  });

  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const initialisePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      customerId: payment.data?.customerId as string,
      customerEphemeralKeySecret: payment.data?.ephemeralKey as string,
      paymentIntentClientSecret: payment.data?.paymentIntent as string,
      merchantDisplayName: "Leace",
      returnURL: "https://example.com",
    });

    if (!error) {
      setPaymentDataInitialized(true);
    }
  };

  async function buy() {
    if (payment.data) {
      initialisePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (!error) {
        navigation.navigate("PaymentResults", {
          isValidPayment: true,
          amount: selectedProduct?.amount as number,
          product: selectedProduct?.name as string,
        });
      }
    }
  }

  if (!payment.data && !paymentDataInitialized) {
    return <Loading />;
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo"
      merchantIdentifier="merchant.identifier"
    >
      <SafeAreaView>
        <View className={`h-full rounded-xl bg-white`}>
          <View className="h-2/6 items-center rounded-xl ">
            <Image
              source={require("../../../assets/logo_1024.png")}
              className="h-52 w-52"
            />
          </View>
          <View className="h-full items-center rounded">
            <View className="mb-10 ">
              <View className="mb-8 flex-row ">
                <Icon name="verified" color="rgb(99 102 241)" size={25} />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  See agencies that liked your profile.
                </Text>
              </View>
              <View className="mb-8 flex-row ">
                <Icon name="verified" color="rgb(99 102 241)" size={25} />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Faster document verification.
                </Text>
              </View>
              <View className="mb-8 flex-row  ">
                <Icon name="verified" color="rgb(99 102 241)" size={25} />
                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Certified member of Leace.
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    backgroundColor: "#e2e8f0",
                    padding: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    borderWidth: 1.5,
                    width: 250,
                    borderColor:
                      selectedProduct?.id === item.id
                        ? "#6366f1"
                        : "transparent",
                    marginTop: item.id !== 1 ? 20 : 0,
                  }}
                  onPress={() => handleCardClick(item)}
                >
                  <Text
                    style={{
                      color:
                        selectedProduct?.id === item.id ? "black" : "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color:
                        selectedProduct?.id === item.id ? "black" : "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.amount}€
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  width: 250,
                  marginTop: Platform.OS === "android" ? 30 : 50,
                  padding: Platform.OS === "android" ? 5 : 10,
                  backgroundColor: "#6366f1",
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={buy}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    textShadowColor: "rgba(0, 0, 0, 0.3)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default TenantOffers;
