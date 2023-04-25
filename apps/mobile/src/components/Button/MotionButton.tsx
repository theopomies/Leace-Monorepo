import React from 'react'
import { ImageSourcePropType, Text } from "react-native"
import { Motion } from "@legendapp/motion";
import { Image } from "react-native-elements"

const MotionButton = ({ path, label, onPress }: { path: ImageSourcePropType, label: string, onPress: () => void }) => {
    return (
        <Motion.Pressable
            className="flex flex-col items-center justify-center"
            onPress={onPress}
        >
            <Motion.View
                whileHover={{ scale: 1.2 }}
                className="rounded border border-gray-400 w-48 items-center justify-center flex"
                whileTap={{ y: 10 }}
                transition={{
                    type: 'spring',
                    damping: 10,
                    stiffness: 100
                }}
            >
                <Image source={path} className="h-20 w-20 mb-4 mt-2 items-center justify-center" />
                <Text className="text-center px-2 pb-5 font-bold">{label}</Text>
            </Motion.View>
        </Motion.Pressable>
    )
}

export default MotionButton