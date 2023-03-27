import { View, ScrollView, Text } from 'react-native';
import React from 'react'

import { trpc } from '../../utils/trpc'
import { PostCard } from '../../components/Card'
import ShowProfile from '../../components/ShowProfile';

const Income = () => {

    const income = trpc.post.getRentIncome.useQuery()

    const posts = trpc.post.getMyPost.useQuery();


    return (
        <ScrollView className="mt-20 mx-5">
            <View>
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto mb-10">EXPENSES</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                {posts.data && income ?
                    posts.data.map(post => (
                        <View key={post.id} className="mb-10 items-center">
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

export default Income