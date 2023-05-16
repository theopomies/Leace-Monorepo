import React from 'react'
import { View, Text } from 'react-native'
import { Button } from "../../components/Button"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';
import CustomInput from '../../components/CustomInput/CustomInput';

export const Contract = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <View className='mt-20'>
            <View className="flex flex-col h-full space-y-16">
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-poppins text-3xl	text-custom mx-auto">CONTRACT</Text>
                </View>
                <View>
                    <CustomInput
                        label="Price"
                        category="price"
                        onChangeAttributesHandler={() => { }}
                        multiline={true}
                        placeholder="Enter price..." />
                    <CustomInput
                        label="Time length"
                        category="time"
                        onChangeAttributesHandler={() => { }}
                        multiline={true}
                        placeholder="Enter time lenght..." />
                    <View className="flex-row flex items-center justify-center mt-20">
                        <View className="mr-10">
                            <Button title={'Cancel'} color={'custom'} onPress={() => navigation.navigate("Chat")} />
                        </View>
                        <View>
                            <Button title={'Next'} color={'custom'} onPress={() => navigation.navigate("Chat")} />
                        </View>
                    </View>
                </View>
            </View>
        </View>

    )
}