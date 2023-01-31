import React from 'react';
import { View, ScrollView } from 'react-native'
import { PostCard } from '../../components/Card/PostCard'

import { trpc } from "../../utils/trpc";

export const ViewPostScreen = () => {

    const posts = trpc.post.getMyPost.useQuery();

    return (
        <ScrollView className="mt-20">
            <View>
                {posts.data ?
                    posts.data.map(post => (
                        <View key={post.id} className="mb-10">
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