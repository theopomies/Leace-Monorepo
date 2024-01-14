import React from "react";
import { PaymentResult } from "../../components/Premium";
import { trpc } from "../../../../web/src/utils/trpc";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { LocalStorage } from "../../utils/cache";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Result = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const updateUser = trpc.user.updateUserById.useMutation();

  const route = useRoute<RouteProp<TabStackParamList, "PaymentResults">>();

  const { userId } = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const isValidPayment = route.params?.isValidPayment;

  const updateStatus = async () => {
    updateUser
      .mutateAsync({
        isPremium: true,
        userId: session?.userId as string,
      })
      .then(() => {
        LocalStorage.setItem("refresh_premium", true);
        navigation.navigate("Premium", { userId });
      });
  };

  return (
    <PaymentResult
      isValidPayment={isValidPayment}
      email={user?.email}
      amount={route.params.amount}
      product={route.params.product}
      firstName={user?.firstName}
      lastName={user?.lastName}
      userId={""}
      updateStatus={updateStatus}
    />
  );
};

export default Result;
