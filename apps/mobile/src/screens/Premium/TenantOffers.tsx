import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

interface Item {
  id: number;
  name: string;
  amount: number;
  period: string;
}

const TenantOffers = () => {
  const items: Item[] = [
    {
      id: 1,
      name: "1 Month",
      amount: 19.99,
      period: "Monthly",
    },
    {
      id: 2,
      name: "1 Year",
      amount: 199.99,
      period: "Yearly",
    },
  ];

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const initialSelectedProduct = items[0] || null;

  const [selectedProduct, setSelectedProduct] = useState<Item | null>(
    initialSelectedProduct,
  );

  const handleCardClick = (item: Item) => {
    setSelectedProduct(item);
  };

  return (
    <>
      <View className={`mt-${Platform.OS === "android" ? 10 : 20}`}>
        <View className="flex-row items-center justify-center space-x-20">
          <TouchableOpacity
            style={{
              padding: 5,
              borderBottomWidth: selectedProduct?.period === "Monthly" ? 2 : 0,
              borderBottomColor:
                selectedProduct?.period === "Monthly" ? "black" : "transparent",
            }}
            onPress={() => items[0] && handleCardClick(items[0])}
          >
            <Text
              className="border"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: selectedProduct?.period === "Monthly" ? "black" : "gray",
              }}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 5,
              borderBottomWidth: selectedProduct?.period === "Yearly" ? 2 : 0,
              borderBottomColor:
                selectedProduct?.period === "Yearly" ? "black" : "transparent",
            }}
            onPress={() => items[1] && handleCardClick(items[1])}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: selectedProduct?.period === "Yearly" ? "black" : "gray",
              }}
            >
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {selectedProduct && (
          <View className="bg-church items-center justify-center ">
            <View className="bg-landing mt-10 h-5/6 w-5/6 items-center justify-center rounded-xl">
              <ImageBackground
                imageStyle={{ borderRadius: 10 }}
                style={styles.gradient}
                className="rounded-xl border"
                source={
                  selectedProduct.period === "Yearly"
                    ? require("../../../assets/red.png")
                    : require("../../../assets/blue.png")
                }
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    marginTop: 40,
                    marginBottom: 130,
                  }}
                >
                  {selectedProduct.period === "Yearly"
                    ? `${selectedProduct.amount}€/year`
                    : `${selectedProduct.amount}€/month`}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 50,
                    color: "white",
                  }}
                >
                  See agencies that liked your profile.
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 50,
                    color: "white",
                  }}
                >
                  Faster document verification.
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Certified member of Leace.
                </Text>
                <TouchableOpacity
                  style={{
                    width: "40%",
                    marginTop: Platform.OS === "android" ? 100 : 145,
                    padding: Platform.OS === "android" ? 5 : 10,
                    backgroundColor: "white",
                    borderRadius: 50,
                    borderColor: "black",
                    alignItems: "center",
                  }}
                  className="border"
                  onPress={() => {
                    navigation.navigate("PaymentDetails", {
                      selectedProduct,
                    });
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: 20,
                      fontWeight: "bold",
                      color:
                        selectedProduct?.period === "Yearly"
                          ? "#D11A2A"
                          : "#3AA3EF",
                      textShadowColor: "rgba(0, 0, 0, 0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    Upgrade
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundImage: "linear-gradient(to bottom, #ff0000, #0000ff)",
  },
});

export default TenantOffers;
