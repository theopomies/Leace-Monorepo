import { RouteProp, useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { PostAttributeCard } from '../../components/Card/PostAttributeCard';

import { trpc } from "../../utils/trpc";
import { TabStackParamList } from '../../navigation/TabNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export const PostDetailsScreen = ({ route }: { route: RouteProp<TabStackParamList, "PostDetails"> }) => {

    const params = route.params.postId;

    const posts = trpc.post.getPost.useQuery(params as unknown as string);

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <ScrollView className="mt-10" showsVerticalScrollIndicator={false}>
            <View className="p-4">
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl text-custom mx-auto">DETAILS</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={require('../../../assets/blank.png')}
                            className="mt-2 mb-10 h-10 w-12 mr-1" />
                    </TouchableOpacity>
                </View>
                {posts.data ?
                    <View>
                        <PostAttributeCard
                            title={posts.data.title}
                            desc={posts.data.desc}
                            content={posts.data.content}
                            location={"Long Beach"}
                            price={1200}
                            size={63}
                            rentStartDate={new Date("2023-03-01T17:25:39.943Z")}
                            rentEndDate={new Date("2023-03-01T17:25:39.943Z")}
                            furnished={true}
                            house={false}
                            appartment={true}
                            terrace={false}
                            pets={true}
                            smoker={false}
                            disability={true}
                            garden={false}
                            parking={true}
                            elevator={false}
                            pool={true}
                        />
                    </View>
                    :
                    <></>}
            </View>
        </ScrollView>
    )
}
