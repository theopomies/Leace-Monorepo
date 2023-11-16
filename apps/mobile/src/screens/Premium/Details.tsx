import React from "react";
import { PaymentView } from "../../components/Premium";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { SafeAreaView, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

const Details = () => {
  const route = useRoute<RouteProp<TabStackParamList, "PaymentDetails">>();

  return (
    <View>
      <StripeProvider
        publishableKey="pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo"
        merchantIdentifier="merchant.identifier"
      >
        <SafeAreaView>
          <PaymentView
            product={route.params.selectedProduct?.name}
            amount={route.params.selectedProduct?.amount}
            buy={route.params.buy}
          />
        </SafeAreaView>
      </StripeProvider>
    </View>
  );
};

export default Details;
