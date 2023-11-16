import { View } from "react-native";
import React from "react";
import { PaymentResult } from "../../components/Premium";
import { trpc } from "../../../../web/src/utils/trpc";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Loading } from "../../components/Loading";

const Result = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: user } = trpc.user.getUserById.useQuery({
    userId: session?.userId as string,
  });

  const updateUser = trpc.user.updateUserById.useMutation();

  const route = useRoute<RouteProp<TabStackParamList, "PaymentResults">>();

  const updateStatus = async () => {
    updateUser.mutateAsync({
      isPremium: true,
      userId: session?.userId as string,
    });
  };

  if (route.params.loading) {
    return <Loading />;
  }

  return (
    <View className="mt-20">
      <PaymentResult
        isValidPayment={route.params.paymentStatus}
        email={user?.email}
        amount={route.params.selectedProduct?.amount}
        firstName={user?.firstName}
        lastName={user?.lastName}
        updateStatus={updateStatus}
      />
    </View>
  );
};

export default Result;
