import { View, Text, ScrollView } from 'react-native'
import React from 'react'

import { trpc } from "../../utils/trpc";
import { Type } from '../../utils/enum';
import { PostCard } from '../../components/Card/PostCard';

export const AvailableScreen = () => {

    const available = trpc.post.getMyPost.useQuery(Type.TO_BE_RENTED)

    return (
        <ScrollView className="mb-20 mt-20 mx-5">
            {available.data && available.data.length > 0 ?
                available.data.map(item => {
                    return (
                        <View key={item.id} className="mb-10">
                            <PostCard title={item.title} desc={item.desc} content={item.content} postId={item.id} income={undefined} expenses={undefined} />
                        </View>
                    )
                })
                :
                <View className="items-center justify-center right-0 left-0 top-80 bottom-80">
                    <Text className="text-3xl font-bold text-center items-center justify-center">No property available at the moment</Text>
                </View>
            }
        </ScrollView >
    )
}