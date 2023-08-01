import React, { useEffect, useState } from "react";
import { trpc } from "../../../../web/src/utils/trpc";
import axios from "axios";
import { PaymentView } from "./View";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { View } from "react-native";

const Details = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const route = useRoute<RouteProp<TabStackParamList, "PaymentDetails">>();

  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const [response, setResponse] = useState("");

  const [paymentStatus, setPaymentStatus] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response && paymentStatus) {
      handlePaymentStatus(response, paymentStatus);
    }
    console.log("type " + typeof response);
  }, [response, loading]);

  const onCheckStatus = (paymentResponse: string, paymentStatus: boolean) => {
    setLoading(true);
    setResponse(paymentResponse);
    setPaymentStatus(!paymentStatus);
  };

  const handlePaymentStatus = async (
    paymentResponse: string,
    paymentStatus: boolean,
  ) => {
    const jsonResponse = JSON.parse(paymentResponse);

    try {
      const stripeResponse = await axios.post("http://localhost:7878/payment", {
        email: user?.email,
        product: route.params.selectedProduct,
        authToken: jsonResponse,
      });

      if (stripeResponse) {
        const { paid } = stripeResponse.data;
        setPaymentStatus(paid);
      }
    } catch (error) {
      console.log(error);
      setPaymentStatus(false);
    } finally {
      setLoading(false);
      navigation.navigate("PaymentResults", {
        loading,
        paymentStatus,
        response,
        selectedProduct: route.params.selectedProduct,
      });
    }
  };

  return (
    <PaymentView
      onCheckStatus={onCheckStatus}
      product={route.params.selectedProduct?.name}
      amount={route.params.selectedProduct?.amount}
    />
  );
};

export default Details;
