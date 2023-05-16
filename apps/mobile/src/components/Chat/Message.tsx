import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements'

const Message = () => {

    return (
        <>
            <View className="self-end bg-custom rounded-xl mb-2 ml-2 w-64 h-16 mt-10 mr-3">
                <View className="flex-row justify-between items-center h-full p-2">
                    <View className="w-4/5">
                        <Text className="text-white text-base p-2">Hi there!</Text>
                    </View>
                    <View className="w-1/5 flex flex-row items-end">
                        <Icon name="check-all" type="material-community" size={16} color="#4caf50" />
                        <Text className="text-white text-sm text-right">10:30 AM</Text>
                    </View>
                </View>
            </View>
            <View className="bg-gray-300 rounded-xl mb-2 mr-2 w-64 h-16 ml-3">
                <View className="flex-row justify-between items-center h-full p-2">
                    <View className="w-4/5">
                        <Text className="text-black text-base p-2">Good morning</Text>
                    </View>
                    <View className="w-1/5 flex flex-row items-end">
                        <Icon name="check" type="material-community" size={16} color="#000000" />
                        <Text className="text-black text-sm text-right">10:32 AM</Text>
                    </View>
                </View>
            </View>

        </>
    );
};

export default Message;
