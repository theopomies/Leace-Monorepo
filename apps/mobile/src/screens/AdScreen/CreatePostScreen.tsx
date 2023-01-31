import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';

import { trpc } from "../../utils/trpc";

import { RouterInputs } from '../../../../web/src/utils/trpc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';

export const CreatePostScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const posts = trpc.post.createPost.useMutation()

    const [post, setPost] = useState<RouterInputs["post"]["createPost"]>({
        title: "",
        desc: "",
        content: ""
    })

    const onChangePostHandler = (key: string, text: string) => {

        if (!key) return

        setPost(prop => ({
            ...prop,
            [key]: text,
        }))
    }

    const createPostButton = async () => {
        if (!post) return
        const postId = await posts.mutateAsync(post);
        if (postId) navigation.navigate("CreatePostAttributes", { postId: postId.id });
    };

    return (
        <ScrollView className="mt-20">
            <View>
                <Text className="font-bold text-2xl text-center">Owner/Agency</Text>
                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangePostHandler("title", text)} value={post.title} placeholder="title" />
                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangePostHandler("desc", text)} value={post.desc} placeholder="description" />
                <TextInput className="h-10 m-3 border p-2.5" onChangeText={text => onChangePostHandler("content", text)} value={post.content} placeholder="content" />
                <Button title="Submit" className="mx-9 mb-4 mt-4 rounded bg-blue-500 py-1 px-4 font-bold text-white hover:bg-blue-700" onPress={() => {
                    createPostButton()
                }} />
            </View>
        </ScrollView>
    );
};
