import React from "react";
import { View, Text, ScrollView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { MotionButton } from "../../components/Button";
import { Button } from "../../components/Button";
import { useAuth } from "@clerk/clerk-expo";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
        color={"custom"}
      />
    </View>
  );
};

const Dashboard = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Dashboard">>();
  const userId = route.params?.userId;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <ScrollView className="mt-20">
      <Text className="font-poppins text-custom mx-auto mb-5 text-center text-3xl">
        DASHBOARD
      </Text>
      <View className="my-10 flex flex-row flex-wrap justify-center">
        <View className="mb-10 mr-20">
          <MotionButton
            path={require("../../../assets/income.png")}
            onPress={() => navigation.navigate("Income", { userId })}
          />
        </View>
        <View className="mb-10">
          <MotionButton
            path={require("../../../assets/expenses.png")}
            onPress={() => navigation.navigate("Expenses", { userId })}
          />
        </View>
        <View className="mb-10 mr-20">
          <MotionButton
            path={require("../../../assets/available.png")}
            onPress={() => navigation.navigate("Available", { userId })}
          />
        </View>
        <View className="mb-10">
          <MotionButton
            path={require("../../../assets/occupied.png")}
            onPress={() => navigation.navigate("Occupied", { userId })}
          />
        </View>
        <View className="mr-20">
          <MotionButton
            path={require("../../../assets/client.png")}
            onPress={() => navigation.navigate("Clients", { userId })}
          />
        </View>
        <View>
          <MotionButton
            path={require("../../../assets/chat.png")}
            onPress={() => navigation.navigate("Chat", { userId })}
          />
        </View>
      </View>
      <View className="flex items-center justify-center">
        <SignOut />
      </View>
    </ScrollView>
  );
};

export default Dashboard;
