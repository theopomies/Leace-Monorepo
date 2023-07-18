import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

import { Icon } from "react-native-elements";

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import { Button } from "../../components/Button";
import React from "react";
import PaymentScreen from "./Screen";

const Offer = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo"
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <PaymentScreen />
    </StripeProvider>
  );
};

export default Offer;
