import { RouteProp } from '@react-navigation/native';
import { View, ScrollView } from 'react-native'
import { PostAttributeCard } from '../../components/Card/PostAttributeCard';

import { trpc } from "../../utils/trpc";
import { TabStackParamList } from '../../navigation/TabNavigator';


export const PostDetailsScreen = ({ route }: { route: RouteProp<TabStackParamList, "PostDetails"> }) => {

    const params = route.params.postId;

    const posts = trpc.post.getPost.useQuery(params as unknown as string);

    return (
        <ScrollView className="mt-20">
            <View className="p-4">
                {posts.data ?
                    <View>
                        <PostAttributeCard
                            title={posts.data.title}
                            desc={posts.data.desc}
                            content={posts.data.content}
                            location={posts.data.attribute.location}
                            price={posts.data.attribute.price}
                            size={posts.data.attribute.size}
                            rentStartDate={new Date(posts.data.attribute.rentStartDate)}
                            rentEndDate={new Date(posts.data.attribute.rentStartDate)}
                            furnished={posts.data.attribute.furnished}
                            house={posts.data.attribute.house}
                            appartment={posts.data.attribute.appartment}
                            terrace={posts.data.attribute.terrace}
                            pets={posts.data.attribute.pets}
                            smoker={posts.data.attribute.smoker}
                            disability={posts.data.attribute.disability}
                            garden={posts.data.attribute.garden}
                            parking={posts.data.attribute.parking}
                            elevator={posts.data.attribute.elevator}
                            pool={posts.data.attribute.pool}
                        />
                    </View>
                    :
                    <></>}
            </View>
        </ScrollView>
    )
}
