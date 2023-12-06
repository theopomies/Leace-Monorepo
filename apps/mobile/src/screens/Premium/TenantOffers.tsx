import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { trpc } from "../../utils/trpc";
import { Icon } from "react-native-elements";
import { Loading } from "../../components/Loading";
import TenantLikes from "./TenantLikes";
import { LocalStorage } from "../../utils/cache";

interface Item {
  id: number;
  name: string;
  amount: number;
  period: string;
  interval: "year" | "month";
}

const TenantOffers = () => {
  const items: Item[] = [
    {
      id: 1,
      name: "1 Month",
      amount: 19.99,
      period: "Monthly",
      interval: "month",
    },
    {
      id: 2,
      name: "1 Year",
      amount: 199.99,
      period: "Yearly",
      interval: "year",
    },
  ];

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const route = useRoute<RouteProp<TabStackParamList, "Premium">>();

  const { userId } = route.params;

  const { data: user, refetch } = trpc.user.getUserById.useQuery({
    userId: userId as string,
  });

  const initialSelectedProduct = items[0] || null;

  const [selectedProduct, setSelectedProduct] = useState<Item | null>(
    initialSelectedProduct,
  );

  const handleCardClick = (item: Item) => {
    setSelectedProduct(item);
    setIsBuyButtonDisabled(true);
  };

  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { data: payment, mutate: createPayment } =
    trpc.stripe.createPayment.useMutation({
      onSuccess: () => {
        setIsBuyButtonDisabled(false);
      },
    });

  const { data: subscription, mutate: confirmPayment } =
    trpc.stripe.confirmPayment.useMutation();

  useEffect(() => {
    if (selectedProduct) {
      createPayment({
        amount: Math.round((selectedProduct.amount as number) * 100),
      });
    }

    if (subscription) {
      setIsLoading(false);
      navigation.navigate("PaymentResults", {
        isValidPayment: true,
        amount: selectedProduct?.amount as number,
        product: selectedProduct?.name as string,
        subscriptionId: subscription.subscriptionId as string,
        userId: user?.id as string,
      });
    }
  }, [selectedProduct, subscription]);

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refresh_premium");
      if (!check) return;
      LocalStorage.setItem("refresh_premium", false);
      refetch();
    }, [userId]),
  );

  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const initialisePaymentSheet = async (
    customerId: string,
    customerSecret: string,
    intentSecret: string,
  ) => {
    await initPaymentSheet({
      customerId: customerId,
      customerEphemeralKeySecret: customerSecret,
      paymentIntentClientSecret: intentSecret,
      merchantDisplayName: "Leace",
      returnURL: "https://example.com",
    });
  };

  async function buy() {
    await initialisePaymentSheet(
      payment?.customerId as string,
      payment?.ephemeralKey as string,
      payment?.paymentIntentClientSecret as string,
    );

    const { error } = await presentPaymentSheet();

    if (!error) {
      try {
        confirmPayment({
          paymentIntentId: payment?.paymentIntentId as string,
          amount: Math.round((selectedProduct?.amount as number) * 100),
          name: selectedProduct?.name as string,
          interval: selectedProduct?.interval === "year" ? "year" : "month",
          customer: payment?.customerId as string,
          userId,
        });
        setIsLoading(true);
      } catch (subscriptionError) {
        console.error("Error creating subscription:", subscriptionError);
        Alert.alert(
          "Error",
          "Failed to create subscription. Please try again.",
        );
      }
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!user?.isPremium) {
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
                  disabled={isBuyButtonDisabled}
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
  } else {
    return <TenantLikes callback={refetch} />;
  }
};

export default TenantOffers;
