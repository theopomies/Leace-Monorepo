import { View, Text, ScrollView } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc'
import { Type } from '../../utils/enum'
import { PostCard } from '../../components/Card'

const Occupied = () => {

    const occupied = trpc.post.getMyPost.useQuery(Type.RENTED)

    return (
        <ScrollView className="mb-20 mt-20 mx-5">
            {occupied.data && occupied.data.length > 0 ?
                occupied.data.map(item => {
                    return (
                        <View key={item.id} className="mb-10">
                            <PostCard title={item.title} desc={item.desc} content={item.content} postId={item.id} income={undefined} expenses={undefined} />
                        </View>
                    )
                })
                :
                <View className="items-center justify-center right-0 left-0 top-80 bottom-80">
                    <Text className="text-3xl font-bold text-center items-center justify-center">No property rented at the moment</Text>
                </View>
            }
        </ScrollView >
    )
}

export default Occupied