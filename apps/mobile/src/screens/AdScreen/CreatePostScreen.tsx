import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
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
        <View className='mt-20'>
            <View className="flex flex-col h-full justify-between">
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-p font-bold text-3xl	text-custom mx-auto">POST</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={require('../../../assets/blank.png')}
                            className="mt-2 mb-2 h-10 w-12 mr-1" />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text className='text-custom font-semibold ml-3'>Title</Text>
                    <TextInput
                        className="h-16 m-3 mb-10 border rounded p-2.5"
                        onChangeText={text => onChangePostHandler("title", text)}
                        value={post.title}
                        multiline={true}
                        placeholder="Enter title..."
                    />
                    <Text className='text-custom font-semibold ml-3'>Description</Text>
                    <TextInput
                        className="h-16 m-3 mb-10 border rounded p-2.5"
                        onChangeText={text => onChangePostHandler("desc", text)}
                        value={post.desc}
                        multiline={true}
                        placeholder="Enter description..."
                    />
                    <Text className='text-custom font-semibold ml-3'>Content</Text>
                    <TextInput
                        className="h-16 m-3 mb-10 border rounded p-2.5"
                        onChangeText={text => onChangePostHandler("content", text)}
                        value={post.content}
                        multiline={true}
                        placeholder="Enter content..."
                    />
                </View>
                <View className="flex-row justify-center mb-10">
                    <TouchableOpacity
                        className="mx-3 py-4 px-10 border border-custom rounded text-white font-semibold mr-10 w-32 h-12 flex justify-center items-center"
                        onPress={() => {
                            navigation.navigate("Stack");
                        }}
                    >
                        <Text className="font-semibold text-custom">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="mx-3 py-4 px-10 bg-custom rounded text-white font-semibold w-32 h-12 flex justify-center items-center"
                        onPress={() => {
                            createPostButton();
                        }}
                    >
                        <Text className="font-semibold text-white">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};
