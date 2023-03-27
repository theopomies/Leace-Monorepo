import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

const Button = ({ title, color, onPress }: { title: string, color: string, onPress?: (() => void) }) => {
    return (
        <TouchableOpacity onPress={onPress} className={`mx-3 py-4 px-10 bg-${color} rounded font-semibold w-32 h-12 flex justify-center items-center`}>
            <Text className="font-semibold text-white">{title}</Text>
        </TouchableOpacity>
    )
}

export default Button