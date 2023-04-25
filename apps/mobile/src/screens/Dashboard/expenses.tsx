import { View, ScrollView, Text } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc'
import { PostCard } from '../../components/Card'
import ShowProfile from '../../components/ShowProfile';

const Expenses = () => {

    const expenses = trpc.post.getRentExpense.useQuery()

    const posts = trpc.post.getMyPost.useQuery();


    return (
        <ScrollView className="mt-20 mx-5" showsVerticalScrollIndicator={false}>
            <View>
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto mb-10">EXPENSES</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                {posts.data && expenses ?
                    posts.data.map(post => (
                        <View key={post.id} className="mb-10 items-center">
                            <PostCard title={post.title} desc={post.desc} content={post.content} postId={post.id} income={undefined} expenses={expenses.data} />
                        </View>
                    ))
                    :
                    <></>
                }
            </View>
        </ScrollView>
    )
}

export default Expenses