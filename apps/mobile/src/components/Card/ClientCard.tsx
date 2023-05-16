import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, TouchableOpacity, ImageSourcePropType } from "react-native";
import { TabStackParamList } from '../../navigation/TabNavigator';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ClientCard = ({ firstName, lastName, email, image }: { firstName: string | null, lastName: string | null, email: string | null, image: ImageSourcePropType }) => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <TouchableOpacity className="w-full max-w-400 rounded-2xl overflow-hidden border border-gray-300" onPress={() => navigation.navigate("Chat")}>
            <View className="flex-row items-center p-2">
                <Image source={image} className="w-20 h-20 rounded-full mr-10" />
                <View className="flex-1">
                    <Text className="text-18 font-bold mb-5">{firstName} {lastName}</Text>
                    <Text className="text-14 text-gray-600 mb-5">{email}</Text>
                </View>
            </View>
            <View className="overflow-hidden rounded-10 border-1 border-gray-300" />
        </TouchableOpacity>
    )
};


export default ClientCard