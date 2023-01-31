import { useNavigation } from "@react-navigation/native";
import { View, Image, Text } from "react-native";
import { Button, Icon } from "react-native-elements"
import { TabStackParamList } from '../../navigation/TabNavigator';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const PostCard = ({ title, desc, content, postId, income, expenses }: { title: string | null, desc: string | null, content: string | null, postId: string, income: number | undefined, expenses: number | undefined }) => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (

        <View className="bg-gray-300 max-w-sm rounded-lg overflow-hidden border-2 mx-2">
            <Image source={require('../../../assets/immeuble.webp')} className="max-w-sm h-80" />
            <View className="ml-5 mt-5">
                <Text className="font-bold text-xl mb-2">{title}</Text>
                <Text className="text-gray-700 text-base mb-0.5">
                    {desc}
                </Text>
                <Text className="text-gray-700 text-base">
                    {content}
                </Text>
                {income !== undefined ? <Text className="text-gray-700 text-base">Income: {income}</Text> : <></>}
                {expenses !== undefined ? <Text className="text-gray-700 text-base">Expenses: {expenses}</Text> : <></>}
            </View>
            <View className="pt-6 pb-4 px-6">
                <Button icon={
                    <Icon
                        className="mr-2"
                        name="more"
                        color="#ffffff"
                        tvParallaxProperties={undefined}
                    />
                } title="View more" className=" px-3 py-1 text-sm font-bold text-gray-700 mr-2 mb-2" onPress={() => {
                    navigation.navigate("PostDetails", { postId: postId });
                }} />

                <Button icon={
                    <Icon
                        className="mr-2"
                        name="edit"
                        color="#ffffff"
                        tvParallaxProperties={undefined}
                    />
                } title="Edit post" className=" px-3 py-1 text-sm font-bold text-gray-700 mr-2 mb-2" />

                <Button icon={
                    <Icon
                        className="mr-2"
                        name="delete"
                        color="#ffffff"
                        tvParallaxProperties={undefined}
                    />
                } title="Delete post" className=" px-3 py-1 text-sm font-bold text-gray-700 mr-2 mb-2" />
            </View>
        </View>
    )
};

