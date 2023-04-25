import React from 'react'
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../navigation/TabNavigator';

const ShowProfile = ({ path }: { path: ImageSourcePropType }) => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
                source={path}
                className="mt-2 mb-10 h-10 w-12 mr-1" />
        </TouchableOpacity>
    )
}

export default ShowProfile