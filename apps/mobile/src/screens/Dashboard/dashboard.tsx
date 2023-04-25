import React from "react";
import { View, Text, ScrollView } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { MotionButton } from "../../components/Button";
import { Button } from "react-native-elements"
import { useAuth } from "@clerk/clerk-expo";

const SignOut = () => {
    const { signOut } = useAuth();
    return (
        <View>
            <Button
                className="mx-9 mt-5 rounded bg-custom  text-white"
                title="Sign Out"
                buttonStyle={{ backgroundColor: "#002642" }}
                onPress={() => {
                    signOut();
                }}
            />
        </View>
    );
};

const Dashboard = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <ScrollView className="mt-20">
            <View className="justify-center items-center p-3 pb-24 mt-10">
                <Text className="text-center font-poppins text-3xl text-custom mx-auto">DASHBOARD</Text>
                <View>
                    <View className="flex flex-wrap justify-center items-center p-3 pb-24 mt-10">
                        <MotionButton path={require("../../../assets/expenses.png")} label={"Expenses"} onPress={() => navigation.navigate("Expenses")} />
                        <MotionButton path={require("../../../assets/income.png")} label={"Income"} onPress={() => navigation.navigate("Income")} />
                        <MotionButton path={require("../../../assets/available.png")} label={"Available"} onPress={() => navigation.navigate("Available")} />
                        <MotionButton path={require("../../../assets/occupied.png")} label={"Occupied"} onPress={() => navigation.navigate("Occupied")} />
                        <MotionButton path={require("../../../assets/client.png")} label={"Clients"} onPress={() => navigation.navigate("Clients")} />
                        <MotionButton path={require("../../../assets/chat.png")} label={"Chat"} onPress={() => navigation.navigate("Chat")} />
                    </View>
                </View>
                <SignOut />
            </View >
        </ScrollView >
    );
}

export default Dashboard