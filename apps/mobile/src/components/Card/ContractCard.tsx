import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

const ContractCard = () => {
    return (
        <View className="justify-center items-center flex mt-5">
            <View className="border border-gray-400 rounded-xl overflow-hidden w-5/6">
                <View className="flex-row items-center p-4">
                    <Image
                        source={require("../../../assets/logo.png")}
                        className='w-10 h-10 mr-2'
                    />
                    <Text className="text-lg font-bold">Contract</Text>
                </View>
                <Image
                    source={require("../../../assets/appart.jpg")}
                    className="w-full h-48"
                />
                <View className="flex-col justify-center p-4 items-center w-full">
                    <TouchableOpacity className="flex border-b border-gray-300 flex-row w-full items-center justify-center px-4 py-2" onPress={() => { console.log("OK") }}>
                        <Text className="ml-4 text-base">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex border-b border-gray-300 flex-row w-full items-center justify-center px-4 py-2" onPress={() => { console.log("OK") }}>
                        <Text className="ml-4 text-base">Counter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex border-b border-gray-300 flex-row w-full items-center justify-center px-4 py-2" onPress={() => { console.log("OK") }}>
                        <Text className="ml-4 text-base">Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ContractCard;
