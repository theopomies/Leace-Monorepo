import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"

export const DashboardScreen = () => {

    return (
        <ScrollView
            className="mt-20">
            <View style={styles.wrapText}>
                <Text style={styles.textTitle}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textTitle: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textDesc: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 30,
    },
    wrapText: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        paddingBottom: 100,
        marginTop: 40,
    },
    cardImg1: {
        position: 'absolute',
        zIndex: 2,
        bottom: 30,
    },
    logoView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
});