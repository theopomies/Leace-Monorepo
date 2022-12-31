import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from "react-native"
import { ModalPopup } from "../../components/Modal/Modal"
import { LineChart } from "react-native-gifted-charts";
import { Button } from "react-native-elements";

const accomodations = [
    {
        name: "T3 210 Avenue",
        address: '210 Avenue',
        price: "1200€",
        link: "link to ad",
        id: 1,
    },
    {
        name: "Studio 310 Avenue",
        address: '310 Avenue',
        price: "550€",
        link: "link to ad",
        id: 2,
    },
    {
        name: "T2 410 Avenue",
        address: '410 Avenue',
        price: "700€",
        link: "link to ad",
        id: 3,
    },
    {
        name: "T2 410 Avenue",
        address: '410 Avenue',
        price: "700€",
        link: "link to ad",
        id: 4,
    },
    {
        name: "T2 410 Avenue",
        address: '410 Avenue',
        price: "700€",
        link: "link to ad",
        id: 5,
    },
    {
        name: "T2 410 Avenue",
        address: '410 Avenue',
        price: "700€",
        link: "link to ad",
        id: 6,
    },
];

const data = [{ value: 0, label: "J" }, { value: 10, label: "F" }, { value: 8, label: "M" }, { value: 58, label: "A" }, { value: 56, label: "M" }, { value: 78, label: "J" }, { value: 74, label: "J" }, { value: 98, label: "A" }, { value: 98, label: "S" }, { value: 98, label: "O" }, { value: 98, label: "N" }, { value: 98, label: "D" }];


const Item = ({ name, address, price, link }: { name: string, address: string, price: string, link: string }) => (
    <View className="items-center mt-5 mb-5 rounded-xl bg-gray-200 p-10">
        <Text className="font-bold text-xl">{address}</Text>
        <Text className="font-bold text-xl">{name}</Text>
        <Image source={require("../../../assets/immeuble.webp")} className="h-20 w-11/12" />
        <Text className="font-bold text-xl">{price}</Text>
        <Text className="font-bold text-xl">{link}</Text>
    </View >
);

const renderItem = ({ item }) => (
    <Item name={item.name} address={item.address} price={item.price} link={item.link} />
);


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
                                <View className="items-center ml-5">
                                    <Text className="mb-5 font-bold text-xl"> 3000$ </Text>
                                    <LineChart
                                        areaChart
                                        isAnimated
                                        curved
                                        data={data}
                                        height={250}
                                        width={400}
                                        showVerticalLines
                                        spacing={35}
                                        initialSpacing={0}
                                        color1="orange"
                                        textColor1="green"
                                        dataPointsColor1="orange"
                                        startFillColor1="orange"
                                        startOpacity={0.8}
                                        endOpacity={0.3}
                                    />
                                    <Button title="Details" className="mt-10 mx-9 rounded bg-black py-1 px-4 font-bold text-white" type="clear" titleStyle={{ color: 'white' }} />
                                </View>
                            </View>
                        </ModalPopup>

                        <TouchableOpacity className="flex flex-col bg-white rounded-lg shadow-md w-full m-6 overflow-hidden sm:w-52">
                            <Image source={require("../../../assets/income.png")} className="h-20 w-20 m-6 ml-20 items-center justify-center" />
                            <Text className="text-center px-2 pb-5 font-bold">Income</Text>
                        </TouchableOpacity>


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
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
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
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </ModalPopup>

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
            </View >
        </ScrollView >
    );
}
