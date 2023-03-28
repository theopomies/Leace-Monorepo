import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'

const ShowAttribute = ({ title, name, type }: { title: string, name: string, type: string }) => {
    return (
        <View className="bg-transparent border rounded-full border-custom h-8 w-24 mr-1 mb-1 flex-row items-center">
            <Icon name={name} type={type} color="#002642" style={{ marginLeft: 16 }} size={15} />
            <Text className="text-custom font-bold text-xs text-center ml-0.5">{title}</Text>
        </View>
    )
}

export default ShowAttribute