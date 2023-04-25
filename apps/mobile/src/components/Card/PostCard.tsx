import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { TabStackParamList } from '../../navigation/TabNavigator';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const PostCard = ({ title, desc, content, postId, income, expenses }: { title: string | null, desc: string | null, content: string | null, postId: string, income: number | undefined, expenses: number | undefined }) => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <TouchableOpacity className="w-full max-w-400 rounded-2xl overflow-hidden border border-gray-300" onPress={() => navigation.navigate("PostDetails", { postId: postId })}>
            <View className="flex-row items-center p-2">
                <Image source={require('../../../assets/appart.jpg')} className="w-20 h-20 rounded-full mr-10" />
                <View className="flex-1">
                    <Text className="text-18 font-bold mb-5">{title}</Text>
                    <Text className="text-14 text-gray-600 mb-5">{desc}</Text>
                    <Text className="text-16">{content}</Text>
                    {income !== undefined ? <Text className="text-14 text-gray-600">Income: {income}</Text> : null}
                    {expenses !== undefined ? <Text className="text-14 text-gray-600">Expenses: {expenses}</Text> : null}
                </View>
            </View>
            <View className="overflow-hidden rounded-10 border-1 border-gray-300" />
        </TouchableOpacity>
    )
};


export default PostCard