import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Button } from "../../components/Button";
import { PaymentView } from "./View";
import axios from "axios";

const PaymentScreen = () => {
  const [response, setResponse] = useState();

  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

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

  const cartInfo = {
    id: 1,
    title: "1 Month",
    price: "€19,99",
    period: "per month",
  };

  const onCheckStatus = async (paymentResponse) => {
    console.log("1");
    setPaymentStatus("Please wait while confirming your payment!");
    console.log("2");

    setResponse(paymentResponse);
    console.log("3");

    const jsonResponse = JSON.parse(paymentResponse);
    // perform operation to check payment status
    console.log("4");

    try {
      const stripeResponse = await axios.post("http://localhost:7878/payment", {
        email: "codergogoi@gmail.com",
        product: cartInfo,
        authToken: jsonResponse,
      });
      console.log("5");

      if (stripeResponse) {
        console.log("6");

        const { paid } = stripeResponse.data;
        console.log("7");

        if (paid === true) {
          console.log("8");

          setPaymentStatus("Payment Success");
        } else {
          console.log("9");

          setPaymentStatus("Payment failed due to some issue");
        }
      } else {
        console.log("10");

        setPaymentStatus(" Payment failed due to some issue");
      }
    } catch (error) {
      console.log("11");

      console.log(error);
      setPaymentStatus(" Payment failed due to some issue");
    }
  };

  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  const handleOfferSelection = (offerId: number | null) => {
    setSelectedOffer(offerId);
  };

  const paymentUI = () => {
    if (!makePayment) {
      return (
        <>
          <View className="">
            <Text className="font-p text-custom ml-2 text-3xl font-bold">
              Subscription
            </Text>
            <Text className="mb-8 ml-2  font-bold text-blue-500">
              Benefits includes:
            </Text>
            <View className="mb-5 flex flex-col">
              {features.map((feature, index) => (
                <React.Fragment key={index}>
                  <View className="mb-2 ml-2 flex flex-row items-center space-y-3 ">
                    <Icon
                      name={feature.icon}
                      color={feature.color}
                      type={feature.type}
                      className="mr-3 mt-3"
                    />
                    <Text className="text-lg font-bold">{feature.title}</Text>
                  </View>
                  <Text className="mb-2 ml-11 font-bold text-gray-800">
                    {feature.description}
                  </Text>
                </React.Fragment>
              ))}
            </View>
            <View className="flex h-60 flex-row items-center justify-center px-4">
              <TouchableOpacity
                className=""
                onPress={() => {
                  handleOfferSelection(cartInfo.id);
                  setMakePayment(true);
                }}
              >
                <Text className="mb-1 text-lg font-bold">Premium</Text>
                <Text className="mb-2 font-bold">{cartInfo.title}</Text>
                <Text className="">
                  Pay {cartInfo.price} {cartInfo.period}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-10 flex items-center justify-center">
            <Button
              title={"Get Started"}
              color={"blue-500"}
              onPress={() => {
                setMakePayment(true);
                console.log(response);
              }}
            />
            <Text className="ml-2 mt-8 text-xs font-bold text-gray-500">
              Subscriptions will automatically renew and your
            </Text>
            <Text className="ml-2 text-xs font-bold text-gray-500">
              credit card will be charged at the end of each period
            </Text>
          </View>
        </>
        // <View
        //   style={{
        //     display: "flex",
        //     flexDirection: "column",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: 300,
        //     marginTop: 50,
        //   }}
        // >
        //   <Text style={{ fontSize: 25, margin: 10 }}> Make Payment </Text>
        //   <Text style={{ fontSize: 16, margin: 10 }}>
        //     {" "}
        //     Product Description: {cartInfo.title}{" "}
        //   </Text>
        //   <Text style={{ fontSize: 16, margin: 10 }}>
        //     {" "}
        //     Payable Amount: {cartInfo.amount}{" "}
        //   </Text>

        //   <TouchableOpacity
        //     style={{
        //       height: 60,
        //       width: 300,
        //       backgroundColor: "#FF5733",
        //       borderRadius: 30,
        //       justifyContent: "center",
        //       alignItems: "center",
        //     }}
        //     onPress={() => {
        //       setMakePayment(true);
        //     }}
        //   >
        //     <Text style={{ color: "#FFF", fontSize: 20 }}>Proceed To Pay</Text>
        //   </TouchableOpacity>
        // </View>
      );
    } else {
      if (response !== undefined) {
        return (
          <View>
            <Text style={{ fontSize: 25, margin: 10 }}> {paymentStatus} </Text>
            <Text style={{ fontSize: 16, margin: 10 }}> {response} </Text>
          </View>
        );
      } else {
        if (selectedOffer !== null) {
          return (
            <PaymentView
              onCheckStatus={onCheckStatus}
              product={cartInfo.title}
              amount={cartInfo.price}
            />
          );
        }
      }
    }
  };

  return <View style={styles.container}>{paymentUI()}</View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100 },
  navigation: { flex: 2, backgroundColor: "red" },
  body: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  footer: { flex: 1, backgroundColor: "cyan" },
});

export { PaymentScreen };
