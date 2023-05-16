import React from 'react'
import { ImageBackground, ImageSourcePropType } from "react-native"
import { Motion } from "@legendapp/motion";

const MotionButton = ({ path, onPress }: { path: ImageSourcePropType, onPress: () => void }) => {
    return (
        <Motion.Pressable
            className="flex flex-col items-center justify-center"
            onPress={onPress}
        >
            <Motion.View
                whileHover={{ scale: 1.2 }}
                className="rounded border border-gray-400 w-32 h-32 items-center justify-center flex"
                whileTap={{ y: 10 }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 300
                }}
            >
                <ImageBackground
                    source={path}
                    className="flex-1 w-full mt-5 h-4/5 items-center justify-center"
                    resizeMode="contain"
                />
            </Motion.View>
        </Motion.Pressable>
    )
}

export default MotionButton