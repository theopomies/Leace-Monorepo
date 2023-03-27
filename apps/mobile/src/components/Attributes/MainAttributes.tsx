import React from 'react'
import { View, Text } from 'react-native'

const MainAttributes = ({ location, price, desc, rentStartDate, rentEndDate, size }: { location: string | undefined, price: number | undefined, desc: string | null, rentStartDate: Date | undefined, rentEndDate: Date | undefined, size: number | undefined }) => {
    return (
        <>
            <Text className="text-custom text-base">
                {location}
            </Text>
            <Text className="text-custom text-base">
                {price}$
            </Text>
            <Text className="text-custom text-base mb-0.5">
                {desc}
            </Text>
            <View className="flex-row mb-2 mt-2">
                <View
                    className="mx-3  bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center">
                    <Text className="font-semibold text-xs text-white">{rentStartDate?.toISOString().split('T')[0]}</Text>
                </View>
                <View
                    className="mx-3  bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center"
                >
                    <Text className="font-semibold text-xs text-white">{rentEndDate?.toISOString().split('T')[0]}</Text>
                </View>
                <View
                    className="mx-3 bg-custom rounded text-white font-semibold w-20 h-12 flex justify-center items-center"
                >
                    <Text className="font-semibold text-center text-sm text-white">{size?.toString()} m²</Text>
                </View>
            </View>
        </>
    )
}

export default MainAttributes