import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

const Button = ({ title, color, onPress }: { title: string, color: string, onPress?: (() => void) }) => {
    return (
        <TouchableOpacity onPress={onPress} className={`bg-${color} py-2 px-3 rounded w-32 h-12 flex items-center justify-center`}>
            <Text className='text-white text-center text-bold text-xl'>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default Button