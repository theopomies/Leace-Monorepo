import { Platform, View } from "react-native";
import React from "react";
import { PaymentResult } from "../../components/Premium";
import { trpc } from "../../../../web/src/utils/trpc";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";

const Result = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const updateUser = trpc.user.updateUserById.useMutation();

  const route = useRoute<RouteProp<TabStackParamList, "PaymentResults">>();

  const isValidPayment = route.params?.isValidPayment;

  const updateStatus = async () => {
    updateUser.mutateAsync({
      isPremium: true,
      userId: session?.userId as string,
    });
  };

  return (
    <View className={`${Platform.OS === "ios" ? "mt-20" : ""}`}>
      <PaymentResult
        isValidPayment={isValidPayment}
        email={user?.email}
        amount={route.params.amount}
        product={route.params.product}
        firstName={user?.firstName}
        lastName={user?.lastName}
        updateStatus={updateStatus}
      />
    </View>
  );
};

export default Result;
