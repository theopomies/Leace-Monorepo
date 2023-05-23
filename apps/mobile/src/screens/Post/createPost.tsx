import React, { useState } from "react";
import { View, Text } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { trpc } from "../../utils/trpc";

import { RouterInputs } from "../../../../web/src/utils/trpc";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";

import { Button } from "../../components/Button";
import ShowProfile from "../../components/ShowProfile";
import CustomInput from "../../components/CustomInput/CustomInput";

const CreatePost = () => {
  const route = useRoute<RouteProp<TabStackParamList, "CreatePost">>();
  const userId = route.params?.userId;

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const posts = trpc.post.createPost.useMutation();

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    title: false,
    desc: false,
    content: false,
  });

  const [post, setPost] = useState<RouterInputs["post"]["createPost"]>({
    title: "",
    desc: "",
    content: "",
  });

  const onChangePostHandler = (key: string, text: string | number) => {
    if (!key) return;

    setPost((prop) => ({
      ...prop,
      [key]: text,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: false }));
  };

  const createPostButton = async () => {
    const newErrors = {
      title: post.title.trim() === "",
      desc: post.desc.trim() === "",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.desc) {
      return;
    }

    if (!post) return;
    const postId = await posts.mutateAsync(post);
    if (postId)
      navigation.navigate("CreatePostAttributes", {
        postId: postId.id,
        userId: userId,
      });
  };

  return (
    <View className="mt-20">
      <View className="flex h-full flex-col space-y-16">
        <View className="ml-10 flex-row items-center justify-center">
          <Text className="font-poppins text-custom mx-auto	text-center text-3xl">
            POST
          </Text>
          <ShowProfile path={require("../../../assets/blank.png")} />
        </View>
        <View>
          <CustomInput
            label="Title"
            value={post.title}
            category="title"
            onChangeAttributesHandler={onChangePostHandler}
            multiline={true}
            placeholder="Enter title..."
            isEmpty={errors.title || false}
          />
          <CustomInput
            label="Description"
            category="desc"
            value={post.desc}
            onChangeAttributesHandler={onChangePostHandler}
            multiline={true}
            placeholder="Enter description..."
            isEmpty={errors.desc || false}
          />
          <CustomInput
            label="Content"
            category="content"
            value={post.content}
            onChangeAttributesHandler={onChangePostHandler}
            multiline={false}
            placeholder="Enter content..."
            isEmpty={errors.content || false}
          />
        </View>
        <View className="flex flex-row items-center justify-center">
          <View className="mr-10">
            <Button
              title={"Cancel"}
              color={"custom"}
              onPress={() => navigation.navigate("Stack", { userId: userId })}
            />
          </View>
          <View>
            <Button
              title={"Next"}
              color={"custom"}
              onPress={() => createPostButton()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreatePost;
