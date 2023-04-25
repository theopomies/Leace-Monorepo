import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { Dropdown } from '../Dropdown/Dropdown'

const BottomBar = ({ onSelect, data, value, handleChange }: { onSelect: (item: { item: string }) => void, data: { item: string, color: string }[], value: string, handleChange: (value: string) => void }) => {
    return (
        <>
            <View className='absolute left-2 bottom-4 flex justify-center items-center w-10 h-10 rounded-full'>
                <Dropdown onSelect={onSelect} data={data} />
            </View>
            <View className='bg-white w-4/5 rounded-lg'>
                <TextInput
                    value={value}
                    onChangeText={handleChange}
                    className='h-full px-10 text-xl'
                    multiline
                    placeholder="Enter message..." />
            </View>

            <TouchableOpacity className='absolute right-2 bottom-4 flex justify-center items-center w-10 h-10 rounded-full'>
                {value ?
                    <Icon size={15} name="send" reverse={true} color="#1461b4fa" />
                    :
                    <></>}
            </TouchableOpacity>
        </>
    )
}

export default BottomBar