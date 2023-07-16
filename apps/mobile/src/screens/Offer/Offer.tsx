import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

import { Icon } from "react-native-elements";

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import { Button } from "../../components/Button";
import React from "react";
import { PaymentScreen } from "./Screen";

const CheckoutScreen = () => {
  console.log("1");

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  console.log("2");

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`https://api.stripe.com/v1/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("3");

    const { paymentIntent, ephemeralKey, customer, setupIntent } =
      await response.json();

    console.log("4");

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      setupIntent,
    };
  };

  const initializePaymentSheet = async () => {
    console.log("5");

    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
      setupIntent,
    } = await fetchPaymentSheetParams();
    console.log("6");

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      returnURL: "stripe-example://stripe-redirect",
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      setupIntentClientSecret: setupIntent,
      customFlow: false,
      style: "alwaysDark",
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    console.log("7");
  };

  const openPaymentSheet = async () => {
    console.log("8");

    try {
      const { error } = await presentPaymentSheet();
      console.log("9");
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert("Success", "Your order is confirmed!");
      }
      console.log("10");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("11");

    initializePaymentSheet();
    console.log("12");
  }, []);

  return (
    <View>
      <Button title="Checkout" onPress={openPaymentSheet} color={"blue-500"} />
    </View>
  );
};

const Offer = () => {
  const features = [
    {
      id: 1,
      title: "Likes",
      description: "See all the users that liked your profile.",
      icon: "person",
      color: "red",
      type: "",
    },
    {
      id: 2,
      title: "Verification",
      description: "Get a faster document verification.",
      icon: "file-document-edit",
      color: "blue",
      type: "material-community",
    },
    {
      id: 3,
      title: "Certification",
      description: "Get to be a certified member of Leace.",
      icon: "verified",
      color: "green",
      type: "",
    },
  ];

  const offers = [
    {
      id: 1,
      title: "1 Month",
      price: "€19,99",
      period: "per month",
    },
    {
      id: 2,
      title: "1 Year",
      price: "€199,99",
      period: "per year",
    },
  ];

  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  const handleOfferSelection = (offerId: number | null) => {
    setSelectedOffer(offerId);
  };

  return (
    <PaymentScreen />
    // <>
    //   <View className="mt-14">
    //     <Text className="font-p text-custom ml-2 mt-8 text-3xl font-bold">
    //       Subscription
    //     </Text>
    //     <Text className="mb-8 ml-2 mt-5 font-bold text-blue-500">
    //       Benefits includes:
    //     </Text>

    //     <View className="mb-5 flex flex-col">
    //       {features.map((feature, index) => (
    //         <React.Fragment key={index}>
    //           <View className="mb-2 ml-2 flex flex-row items-center space-y-3 ">
    //             <Icon
    //               name={feature.icon}
    //               color={feature.color}
    //               type={feature.type}
    //               className="mr-3 mt-3"
    //             />
    //             <Text className="text-lg font-bold">{feature.title}</Text>
    //           </View>
    //           <Text className="mb-2 ml-11 font-bold text-gray-800">
    //             {feature.description}
    //           </Text>
    //         </React.Fragment>
    //       ))}
    //     </View>

    //     <View className="flex h-60 flex-row items-center justify-center px-4">
    //       {offers.map((offer, index) => (
    //         <TouchableOpacity
    //           key={offer.id}
    //           className={`my-4 ${
    //             index === 0 ? "mr-2" : "ml-2"
    //           } flex h-5/6 w-1/2 flex-col items-center justify-center rounded-lg p-4 ${
    //             selectedOffer === offer.id
    //               ? offer.id === 1
    //                 ? "bg-blue-400"
    //                 : "bg-red-400"
    //               : "bg-gray-200"
    //           }`}
    //           onPress={() => handleOfferSelection(offer.id)}
    //         >
    //           <Text className="mb-1 text-lg font-bold">Premium</Text>
    //           <Text className="mb-2 font-bold">{offer.title}</Text>
    //           <Text className="">
    //             Pay {offer.price} {offer.period}
    //           </Text>
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   </View>
    //   <View className="mt-10 flex items-center justify-center">
    //     <StripeProvider publishableKey="pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo">
    //       <CheckoutScreen />
    //       <Button
    //         title={"Get Started"}
    //         color={"blue-500"}
    //         onPress={() => {
    //           console.log(selectedOffer);
    //         }}
    //       />
    //     </StripeProvider>
    //     <Text className="ml-2 mt-8 text-xs font-bold text-gray-500">
    //       Subscriptions will automatically renew and your
    //     </Text>
    //     <Text className="ml-2 text-xs font-bold text-gray-500">
    //       credit card will be charged at the end of each period
    //     </Text>
    //   </View>
    // </>
  );
};

export default Offer;
