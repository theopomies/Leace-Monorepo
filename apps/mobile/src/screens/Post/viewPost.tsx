import React from 'react';
import { View, ScrollView, Text } from 'react-native'
import { PostCard } from '../../components/Card'

import { trpc } from "../../utils/trpc";
import ShowProfile from '../../components/ShowProfile';

const ViewPost = () => {

    const posts = trpc.post.getMyPost.useQuery();

    return (
        <ScrollView className="mt-20 mx-5">
            <View>
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-poppins text-3xl	text-custom mx-auto mb-10">PROPERTIES</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                {posts.data ?
                    posts.data.map(post => (
                        <View key={post.id} className="mb-10 items-center">
                            <PostCard title={post.title} desc={post.desc} content={post.content} postId={post.id} income={undefined} expenses={undefined} />
                        </View>
                    ))
                    :
                    <></>
                }
            </View>
        </ScrollView>
    );
}

export default ViewPost 