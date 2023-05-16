import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { trpc } from "../../utils/trpc";

import { RouterInputs } from '../../../../web/src/utils/trpc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabStackParamList } from '../../navigation/TabNavigator';

import { Button } from "../../components/Button"
import ShowProfile from '../../components/ShowProfile';
import CustomInput from '../../components/CustomInput/CustomInput';

const CreatePost = () => {

    const navigation = useNavigation<NativeStackNavigationProp<TabStackParamList>>();

    const posts = trpc.post.createPost.useMutation()

    const [post, setPost] = useState<RouterInputs["post"]["createPost"]>({
        title: "",
        desc: "",
        content: ""
    })

    const onChangePostHandler = (key: string, text: string | number) => {

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
            <View className="flex flex-col h-full space-y-16">
                <View className="flex-row justify-center items-center ml-10">
                    <Text className="text-center font-poppins text-3xl	text-custom mx-auto">POST</Text>
                    <ShowProfile path={require("../../../assets/blank.png")} />
                </View>
                <View>
                    <CustomInput
                        label="Title"
                        value={post.title}
                        category="title"
                        onChangeAttributesHandler={onChangePostHandler}
                        multiline={true}
                        placeholder="Enter title..." />
                    <CustomInput
                        label="Description"
                        category="desc"
                        value={post.desc}
                        onChangeAttributesHandler={onChangePostHandler}
                        multiline={true}
                        placeholder="Enter description..." />
                    <CustomInput
                        label="Content"
                        category="content"
                        value={post.content}
                        onChangeAttributesHandler={onChangePostHandler}
                        multiline={false}
                        placeholder="Enter content..." />
                </View>
                <View className="flex-row flex items-center justify-center">
                    <View className="mr-10">
                        <Button title={'Cancel'} color={'custom'} onPress={() => navigation.navigate("Stack")} />
                    </View>
                    <View>
                        <Button title={'Next'} color={'custom'} onPress={() => createPostButton()} />
                    </View>
                </View>
            </View>
        </View>

    );
};

export default CreatePost