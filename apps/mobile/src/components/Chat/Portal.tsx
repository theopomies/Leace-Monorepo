import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Icon } from "react-native-elements"
import { ReportModal } from '../Modal';
import BottomBar from './BottomBar';
import Message from "./Message"
import { ContractCard } from '../Card';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';

export const Portal = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const [value, setValue] = useState('');
    const [selected, setSelected] = useState({ item: "" })

    const onSelect = (item: { item: string }) => {
        setSelected(item)

        if (item.item === "Contract") {
            navigation.navigate("Contract")
        }
    }

    const handleChange = (text: string) => {
        setValue(text);
    };

    const data = [
        { item: 'Contract' },
        { item: 'Photo & Video' },
        { item: 'Document' },
        { item: 'Report' },
    ];

    return (
        <View className="mt-10">
            <View className="flex-row items-center bg-white border-b border-gray-400 p-3" >
                <TouchableOpacity className="mr-5" onPress={() => navigation.navigate("Dashboard")}>
                    <Icon size={20} name="arrow-back-ios" type='material-icons' color={'#002642'} />
                </TouchableOpacity>
                <Image source={require('../../../assets/blank.png')} className="w-10 h-10 rounded-full mr-10" />
                <Text className="flex text-center ml-5 font-bold text-2xl">John Doe</Text>
            </View>

            {selected.item === "Report" ? <ReportModal cond={false} visible={true} /> : null}

            <Message />

            <ContractCard />

            <View className="flex justify-between items-center absolute left-0 bottom-0 max-h-100 p-5 w-full">
                <BottomBar onSelect={onSelect} data={data} value={value} handleChange={handleChange} />
            </View>
        </View>
    );
}