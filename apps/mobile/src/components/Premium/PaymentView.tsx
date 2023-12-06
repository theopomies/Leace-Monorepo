// import {
//   useStripe,
//   CardForm,
//   usePaymentSheet,
// } from "@stripe/stripe-react-native";
// import React, { useEffect } from "react";
// import { View, Text, Platform, Alert } from "react-native";
// import { trpc } from "../../utils/trpc";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { TabStackParamList } from "../../navigation/TabNavigator";
// import { Button } from "react-native-elements";
// import Header from "../Header";

// const PaymentView = ({
//   amount,
//   product,
//   buy,
// }: {
//   amount: number;
//   product: string;
//   buy: any;
// }) => {
//   const payment = trpc.stripe.createPayment.useQuery({
//     amount: Math.round(amount * 100),
//   });

//   const { confirmPayment } = useStripe();

//   const { data: session } = trpc.auth.getSession.useQuery();

//   const user = trpc.user.getUserById.useQuery({
//     userId: session?.userId as string,
//   });

//   const navigation =
//     useNavigation<NativeStackNavigationProp<TabStackParamList>>();

//   const handleConfirmation = async () => {
//     if (payment.data?.paymentIntent) {
//       try {
//         const { paymentIntent, error } = await confirmPayment(
//           payment.data.paymentIntent as string,
//           {
//             paymentMethodType: "Card",
//             paymentMethodData: {
//               billingDetails: {
//                 email: user.data?.email as string,
//               },
//             },
//           },
//         );

//         if (!error) {
//           navigation.navigate("PaymentResults", {
//             isValidPayment: true,
//             paymentIntent,
//             amount,
//             product,
//           });
//         } else {
//           navigation.navigate("PaymentResults", {
//             isValidPayment: false,
//             paymentIntent,
//             amount,
//             product,
//           });
//         }
//       } catch (error) {
//         console.error("Error in payment confirmation:", error);
//         // Handle errors appropriately
//       }
//     }
//   };
//   return (
//     <View>
//       <Header />
//       <View className="mt-10 flex h-full w-full flex-col items-center">
//         <View className="">
//           <Text className="mb-5 text-4xl font-bold text-indigo-500">
//             €{amount}
//           </Text>
//           <Text className="mb-20 text-2xl font-bold">{product}</Text>
//         </View>
//         <View className=" item-center w-5/6">
//           <View className="">
//             <Text className="mb-4 text-2xl font-bold">Card information</Text>
//           </View>

//           <CardForm
//             style={{
//               height: Platform.OS === "ios" ? 350 : 300,
//               backfaceVisibility: "hidden",
//               width: "100%",
//               marginVertical: 10,
//             }}
//           />
//         </View>
//         <View className="">
//           <Button
//             title="Pay"
//             icon={{
//               name: "lock",
//               type: "font-awesome",
//               size: 15,
//               color: "white",
//             }}
//             iconContainerStyle={{ marginRight: 10 }}
//             titleStyle={{ fontWeight: "700" }}
//             buttonStyle={{
//               backgroundColor: "#6466f1",
//               borderColor: "transparent",
//               borderWidth: 0,
//               borderRadius: 15,
//             }}
//             containerStyle={{
//               width: 150,
//               marginHorizontal: 50,
//               marginVertical: 10,
//             }}
//             onPress={buy}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PaymentView;
