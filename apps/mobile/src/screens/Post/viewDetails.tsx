import { RouteProp } from '@react-navigation/native';
import { View, Text, ScrollView } from 'react-native'
import { PostAttributeCard } from '../../components/Card';

import { trpc } from "../../utils/trpc";
import { TabStackParamList } from '../../navigation/TabNavigator';
import ShowProfile from '../../components/ShowProfile';


const ViewDetails = ({ route }: { route: RouteProp<TabStackParamList, "PostDetails"> }) => {

    const params = route.params.postId;

    const posts = trpc.post.getPost.useQuery(params as unknown as string);

    return (
        <ScrollView className="mt-10" showsVerticalScrollIndicator={false}>
            <View className="p-4">
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-poppins text-3xl text-custom mx-auto">DETAILS</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                {posts.data ?
                    <View>
                        <PostAttributeCard
                            title={posts.data.title}
                            desc={posts.data.desc}
                            content={posts.data.content}
                            location={posts.data.attribute?.location}
                            price={posts.data.attribute?.price}
                            size={posts.data.attribute?.size}
                            rentStartDate={posts.data.attribute?.rentStartDate}
                            rentEndDate={posts.data.attribute?.rentEndDate}
                            furnished={posts.data.attribute?.furnished}
                            house={posts.data.attribute?.house}
                            appartment={posts.data.attribute?.appartment}
                            terrace={posts.data.attribute?.terrace}
                            pets={posts.data.attribute?.pets}
                            smoker={posts.data.attribute?.smoker}
                            disability={posts.data.attribute?.disability}
                            garden={posts.data.attribute?.garden}
                            parking={posts.data.attribute?.parking}
                            elevator={posts.data.attribute?.elevator}
                            pool={posts.data.attribute?.pool}
                        />
                    </View>
                    :
                    <></>}
            </View>
        </ScrollView>
    )
}

export default ViewDetails