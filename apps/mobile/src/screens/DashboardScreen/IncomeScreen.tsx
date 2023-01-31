import { View, ScrollView } from 'react-native';
import React from 'react'

import { trpc } from '../../utils/trpc'
import { PostCard } from '../../components/Card/PostCard'

export const IncomeScreen = () => {

    const income = trpc.post.getRentIncome.useQuery()

    const posts = trpc.post.getMyPost.useQuery();


    return (
        <ScrollView className="mb-20 mt-20">
            <View className="items-center mb-20 mt-20">
                {posts.data && income ?
                    posts.data.map(post => (
                        <View key={post.id} className="mb-10">
                            <PostCard title={post.title} desc={post.desc} content={post.content} postId={post.id} income={income.data} expenses={undefined} />
                        </View>
                    ))
                    :
                    <></>
                }
            </View>
        </ScrollView>
    )
}