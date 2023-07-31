import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

interface Item {
  id: number;
  name: string;
  amount: number;
  period: string;
}

const OffersList = ({}) => {
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

  const items = [
    {
      id: 1,
      name: "T Shirt - With React Native Logo",
      amount: 19.99,
      period: "1 month",
    },
    {
      id: 2,
      name: "Hoodie - With React Native Logo",
      amount: 199.99,
      period: "1 year",
    },
  ];

  const [selectedOffer, setSelectedOffer] = useState<number | null>(0);

  const [selectedProduct, setSelectedProduct] = useState<Item | null>();
  const [makePayment, setMakePayment] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const handleOfferSelection = (offerId: number | null) => {
    setSelectedOffer(offerId);

    if (offerId === null) {
      setSelectedProduct(null);
    } else {
      const selectedProduct = items.find((item) => item.id === offerId);
      if (selectedProduct) {
        setSelectedProduct(selectedProduct);
      }
    }
  };

  return (
    <>
      <View className={`mt-20`}>
        <Text className={`text-custom ml-2 text-3xl font-bold`}>
          Subscription
        </Text>
        <Text className={`ml-2 mt-5 font-bold text-blue-500`}>
          Benefits includes:
        </Text>

        <View className={`mb-5 flex flex-col`}>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <View
                className={`mb-2 ml-2 flex flex-row items-center space-y-3`}
              >
                <Icon
                  name={feature.icon}
                  color={feature.color}
                  type={feature.type}
                  className={`mr-3 mt-3`}
                />
                <Text className={`text-lg font-bold`}>{feature.title}</Text>
              </View>
              <Text className={`mb-2 ml-11 font-bold text-gray-800`}>
                {feature.description}
              </Text>
            </React.Fragment>
          ))}
        </View>

        <View className={`flex h-60 flex-row items-center justify-center px-4`}>
          {items.map((offer, index) => (
            <TouchableOpacity
              key={offer.id}
              className={`my-4 ${
                index === 0 ? "mr-2" : "ml-2"
              } flex h-5/6 w-1/2 flex-col items-center justify-center rounded-lg p-4 ${
                selectedOffer === offer.id
                  ? offer.id === 1
                    ? "bg-blue-400"
                    : "bg-red-400"
                  : "bg-gray-200"
              }`}
              onPress={() => handleOfferSelection(offer.id)}
            >
              <Text className={`mb-1 text-lg font-bold`}>Premium</Text>
              <Text className={`mb-2 font-bold`}>{offer.name}</Text>
              <Text className={``}>
                Pay {offer.amount} {offer.period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="items-center">
        <TouchableOpacity
          className={`mt-5 w-1/2 items-center justify-center rounded-lg bg-blue-400 px-6 py-3`}
          onPress={() => {
            if (selectedProduct !== undefined) {
              setMakePayment(true);
              navigation.navigate("PaymentDetails", {
                selectedProduct,
                makePayment,
              });
            }
          }}
          disabled={selectedProduct === undefined}
        >
          <Text className={`text-xl font-bold text-white`}>Proceed To Pay</Text>
        </TouchableOpacity>
        <View className={`mt-10 flex items-center justify-center`}>
          <Text className={`ml-2 text-xs font-bold text-gray-500`}>
            Subscriptions will automatically renew and your
          </Text>
          <Text className={`ml-2 text-xs font-bold text-gray-500`}>
            credit card will be charged at the end of each period
          </Text>
        </View>
      </View>
    </>
  );
};

export default OffersList;
