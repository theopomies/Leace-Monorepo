import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Icon } from 'react-native-elements'

export const Dropdown = ({ data, onSelect = (item: { item: string }) => { item } }: { data: Array<{ item: string, color: string }>, onSelect: (item: { item: string }) => void }) => {

    const [showOptions, setShowOptions] = useState(false)

    const [caret, setCaret] = useState(false)

    const onSelectedItem = (value: { item: string }) => {
        setShowOptions(false)
        onSelect(value)
    }

    return (
        <View className='relative'>
            {showOptions ? (
                <View className='absolute bottom-9 gap-y-1 bg-gray-300 p-2 rounded-lg'>
                    {data.map((value: { item: string, color: string }, i: number) => {
                        return (
                            <TouchableOpacity className={`${value.color} h-8 w-20 items-center flex justify-center rounded-lg`} onPress={() => onSelectedItem(value)} key={String(i)}>
                                <Text className="font-bold text-center text-white">{value.item}</Text>
                            </TouchableOpacity>)
                    })}
                </View>) : null}
            <TouchableOpacity onPress={() => { setShowOptions(!showOptions); setCaret(!caret) }}>
                {caret ?
                    <View className="">
                        <Icon size={25} name='caret-down' type='font-awesome' color="#1461b4fa" tvParallaxProperties={undefined} />
                    </View> :
                    <View className="">
                        <Icon size={25} name='caret-up' type='font-awesome' color="#1461b4fa" tvParallaxProperties={undefined} />
                    </View>
                }
            </TouchableOpacity>
        </View>
    )
}