import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"

export const DashboardScreen = () => {

    return (
        <ScrollView className="mt-20">
            <View className="justify-center items-center p-3 pb-24 mt-10">
                <Text className=" text-3xl font-bold text-center items-center justify-center">
                    Dashboard
                </Text>
                <View>
                    <View className="w-30 flex-1 items-center justify-center">
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image className="h-20 w-20 m-6 ml-20 items-center justify-center" source={require("../../../assets/expenses.png")} />
                            <Text className="text-center px-2 pb-5 font-bold">Expenses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/income.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Income</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/available.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Available</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/occupied.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Occupied</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/client.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Clients</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/chat.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
