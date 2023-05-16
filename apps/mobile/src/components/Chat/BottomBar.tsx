import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { Dropdown } from '../Dropdown/Dropdown'

const BottomBar = ({ onSelect, data, value, handleChange }: { onSelect: (item: { item: string }) => void, data: { item: string }[], value: string, handleChange: (value: string) => void }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <View className="w-full h-full flex-row items-center mt-48">
            <View className="flex-rom mr-2">
                <Dropdown onSelect={onSelect} data={data} showOptions={showOptions} setShowOptions={setShowOptions} />
            </View>
            {showOptions ? null : (
                <View className="flex-1 bg-white rounded-lg py-1 px-3 flex-row">
                    <TextInput
                        value={value}
                        onChangeText={handleChange}
                        className="flex-1"
                        placeholder="Type a message" />
                    <TouchableOpacity disabled={!value}>
                        <Icon size={15} name="send" reverse color={value ? '#002642' : '#BDBDBD'} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default BottomBar;
