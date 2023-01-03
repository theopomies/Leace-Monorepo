import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from "react-native"
import { ModalPopup } from "../../components/Modal/Modal"

import { accomodations } from "./Dummy"
import { data } from "./Dummy"
import { contacts } from "./Dummy"
import { expenses_dummy } from "./Dummy"

export const DashboardScreen = () => {

    const [expenses, setExpenses] = useState(false);
    const [income, setIncome] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isOccupied, setIsOccupied] = useState(false);
    const [chat, setChat] = useState(false);
    const [client, setClient] = useState(false);

    return (
        <ScrollView className="mt-20">
            <View className="justify-center items-center p-3 pb-24 mt-10">

                <Text className=" text-3xl font-bold text-center items-center justify-center">
                    Dashboard
                </Text>

                <View>
                    <View className="w-30 flex-1 items-center justify-center">

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52" onPress={() => {
                            setExpenses(true);
                        }}>
                            <Image className="h-20 w-20 m-6 ml-20 items-center justify-center" source={require("../../../assets/expenses.png")} />
                            <Text className="text-center px-2 pb-5 font-bold">Expenses</Text>
                        </TouchableOpacity>
                        <ModalPopup visible={expenses}>
                            <View className="items-center mb-20">
                                <TouchableOpacity onPress={() => {
                                    setExpenses(false);
                                }}>
                                    <Image
                                        source={require('../../../assets/x.png')}
                                        className="h-8 w-8 mb-5"
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    data={expenses_dummy}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity>
                                            <View className="items-center mt-5 mb-5 rounded-xl bg-gray-200 p-10">
                                                <Image source={require("../../../assets/immeuble.webp")} className="h-20 w-11/12" />
                                                <Text className="font-bold text-xl">maintenance: {item.maintenance}</Text>
                                                <Text className="font-bold text-xl">agency fees: {item.agency}</Text>
                                                <Text className="font-bold text-xl">housing price: {item.price}</Text>
                                            </View >
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </ModalPopup>

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52" onPress={() => {
                            setIncome(true);
                        }}>
                            <Image source={require("../../../assets/income.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Income</Text>
                        </TouchableOpacity>
                        <ModalPopup visible={income}>
                            <View className="items-center mb-20">
                                <TouchableOpacity onPress={() => {
                                    setIncome(false);
                                }}>
                                    <Image
                                        source={require('../../../assets/x.png')}
                                        className="h-8 w-8 mb-5"
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    data={data}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity>
                                            <View className="items-center mt-5 mb-5 rounded-xl bg-gray-200 p-10">
                                                <Image source={require("../../../assets/immeuble.webp")} className="h-20 w-11/12" />
                                                <Text className="font-bold text-xl">consumption: {item.energy}</Text>
                                                <Text className="font-bold text-xl">security deposit: {item.deposit}</Text>
                                                <Text className="font-bold text-xl">rental charges: {item.charges}</Text>
                                                <Text className="font-bold text-xl">equipment costs: {item.equipment}</Text>
                                                <Text className="font-bold text-xl">other costs: {item.other}</Text>
                                            </View >
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </ModalPopup>


                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52" onPress={() => {
                            setIsAvailable(true);
                        }} >
                            <Image source={require("../../../assets/available.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Available</Text>
                        </TouchableOpacity>
                        <ModalPopup visible={isAvailable}>
                            <View className="items-center">
                                <TouchableOpacity onPress={() => {
                                    setIsAvailable(false);
                                }}>
                                    <Image
                                        source={require('../../../assets/x.png')}
                                        className="h-8 w-8 mb-5"
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    data={accomodations}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View className="items-center mt-5 mb-5 rounded-xl bg-gray-200 p-10">
                                            <Text className="font-bold text-xl">{item.address}</Text>
                                            <Text className="font-bold text-xl">{item.name}</Text>
                                            <Image source={require("../../../assets/immeuble.webp")} className="h-20 w-11/12" />
                                            <Text className="font-bold text-xl">{item.price}</Text>
                                            <Text className="font-bold text-xl">{item.link}</Text>
                                        </View >
                                    )}
                                />
                            </View>
                        </ModalPopup>

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52" onPress={() => {
                            setIsOccupied(true);
                        }} >
                            <Image source={require("../../../assets/occupied.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Occupied</Text>
                        </TouchableOpacity>
                        <ModalPopup visible={isOccupied}>
                            <View className="items-center">
                                <TouchableOpacity onPress={() => {
                                    setIsOccupied(false);
                                }}>
                                    <Image
                                        source={require('../../../assets/x.png')}
                                        className="h-8 w-8 mb-5"
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    data={accomodations}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View className="items-center mt-5 mb-5 rounded-xl bg-gray-200 p-10">
                                            <Text className="font-bold text-xl">{item.address}</Text>
                                            <Text className="font-bold text-xl">{item.name}</Text>
                                            <Image source={require("../../../assets/immeuble.webp")} className="h-20 w-11/12" />
                                            <Text className="font-bold text-xl">{item.price}</Text>
                                            <Text className="font-bold text-xl">{item.link}</Text>
                                        </View >
                                    )}
                                />
                            </View>
                        </ModalPopup>

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52" onPress={() => {
                            setClient(true);
                        }} >
                            <Image source={require("../../../assets/client.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Clients</Text>
                        </TouchableOpacity>
                        <ModalPopup visible={client}>
                            <View className="items-center mb-20">
                                <TouchableOpacity onPress={() => {
                                    setClient(false);
                                }}>
                                    <Image
                                        source={require('../../../assets/x.png')}
                                        className="h-8 w-8 mb-14"
                                    />
                                </TouchableOpacity>
                                <View className="items-center ml-5 flex-row">
                                    <FlatList
                                        data={contacts}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <ScrollView className="border-2 mb-2">
                                                <View>
                                                    <View className="items-center">
                                                        <TouchableOpacity>
                                                            <Image
                                                                source={require('../../../assets/face.jpeg')}
                                                                className="h-8 w-8 rounded-2xl mx-1.5"
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View className="items-center">

                                                        <TouchableOpacity>
                                                            <Text className="font-bold text-2xl">{item.name}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View className="items-center">

                                                        <TouchableOpacity onPress={() => {
                                                            setClient(false)
                                                            setChat(true)
                                                        }}>
                                                            <Image
                                                                source={require('../../../assets/chat.png')}
                                                                className="h-8 w-8 rounded-2xl mx-1.5"
                                                            />
                                                        </TouchableOpacity>
                                                    </View>


                                                </View>
                                            </ScrollView>
                                        )} />
                                </View>
                            </View>
                        </ModalPopup>

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/chat.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Chat</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View >
        </ScrollView >
    );
}
