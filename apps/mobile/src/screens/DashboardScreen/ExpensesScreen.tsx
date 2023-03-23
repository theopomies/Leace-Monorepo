import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { trpc } from '../../utils/trpc'
import { PostCard } from '../../components/Card/PostCard'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TabStackParamList } from '../../navigation/TabNavigator'

export const ExpensesScreen = () => {

    const expenses = trpc.post.getRentExpense.useQuery()

    const posts = trpc.post.getMyPost.useQuery();

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    return (
        <ScrollView className="mt-20 mx-5">
            <View>
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto mb-10">EXPENSES</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={require('../../../assets/blank.png')}
                            className="mt-2 mb-10 h-10 w-12 mr-1" />
                    </TouchableOpacity>
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