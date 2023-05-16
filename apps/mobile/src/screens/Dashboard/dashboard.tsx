import React from "react";
import { View, Text, ScrollView } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { MotionButton } from "../../components/Button";
import { Button } from "../../components/Button"
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
                color={"custom"} />
        </View>
    );
};

const Dashboard = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <ScrollView className="mt-20">
            <Text className="text-center font-poppins text-3xl mb-5 text-custom mx-auto">DASHBOARD</Text>
            <View className="flex flex-wrap flex-row justify-center my-10">
                <View className="mr-20 mb-10">
                    <MotionButton path={require("../../../assets/income.png")} onPress={() => navigation.navigate("Income")} />
                </View>
                <View className="mb-10">
                    <MotionButton path={require("../../../assets/expenses.png")} onPress={() => navigation.navigate("Expenses")} />
                </View>
                <View className="mr-20 mb-10">
                    <MotionButton path={require("../../../assets/available.png")} onPress={() => navigation.navigate("Available")} />
                </View>
                <View className="mb-10">
                    <MotionButton path={require("../../../assets/occupied.png")} onPress={() => navigation.navigate("Occupied")} />
                </View>
                <View className="mr-20">
                    <MotionButton path={require("../../../assets/client.png")} onPress={() => navigation.navigate("Clients")} />
                </View>
                <View>
                    <MotionButton path={require("../../../assets/chat.png")} onPress={() => navigation.navigate("Chat")} />
                </View>
            </View>
            <View className="items-center flex justify-center">
                <SignOut />
            </View>
        </ScrollView>



    );
}

export default Dashboard