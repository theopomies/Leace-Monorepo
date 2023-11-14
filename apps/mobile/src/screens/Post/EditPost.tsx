import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";
import { Icon } from "react-native-elements";
import { IDefaulAttributes } from "../../types";
import { CreateAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";

export default function EditPost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "EditProfile">>();
  const { data, userId } = route.params;
  const [postInfo, setPostInfo] = useState<{
    postId: string;
    title: string;
    content: string;
    desc: string;
  }>();
  const [postAttrs, setPostAttrs] = useState<IDefaulAttributes>();
  const editPost = trpc.post.updatePostById.useMutation();
  const editAttrs = trpc.attribute.updatePostAttributes.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshPosts", true);
      LocalStorage.setItem("refreshPost", true);
      navigation.navigate("PostInfo", {
        userId,
        postId: postInfo?.postId ?? "",
        editable: true,
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      const parsed = JSON.parse(data);
      const { id, desc, title, content, attribute } = parsed;
      setPostInfo({ postId: id, desc, title, content });
      setPostAttrs({
        ...attribute,
        rentStartDate: new Date(attribute.rentStartDate),
        rentEndDate: new Date(attribute.rentEndDate),
      });
    }, [route]),
  );

  function handlePost() {
    if (!postInfo || !postAttrs) return;
    editPost.mutate(postInfo);
    editAttrs.mutate(postAttrs);
  }

  if (!postInfo || !postAttrs) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View className="flex h-14 flex-row items-center">
          <TouchableOpacity
            className="ml-4"
            onPress={() =>
              navigation.navigate("PostInfo", {
                userId,
                postId: postInfo.postId,
                editable: true,
              })
            }
          >
            <Icon
              name="arrow-back"
              color="#10316B"
              size={30}
              type="material-icons"
            ></Icon>
          </TouchableOpacity>
          <Text>Edit Post</Text>
        </View>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ backgroundColor: "white" }}
          >
            <View className="flex-1 space-y-2 p-4">
              <View>
                <Text className="text-base font-bold text-[#10316B]">
                  Tittle
                </Text>
                <TextInput
                  className="border-b border-[#D3D3D3] py-1.5 font-light leading-loose focus:border-blue-500"
                  placeholder="Enter title..."
                  defaultValue={postInfo.title}
                  onChangeText={(text) =>
                    setPostInfo({ ...postInfo, title: text })
                  }
                />
              </View>
              <View>
                <Text className="text-base font-bold text-[#10316B]">
                  Description
                </Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  className="border-b border-[#D3D3D3] py-1.5 font-light leading-loose focus:border-blue-500"
                  placeholder="Enter description..."
                  defaultValue={postInfo.desc}
                  onChangeText={(text) =>
                    setPostInfo({ ...postInfo, desc: text })
                  }
                />
              </View>
              <View>
                <Text className="text-base font-bold text-[#10316B]">
                  Content
                </Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  defaultValue={postInfo.content}
                  className="border-b border-[#D3D3D3] py-1.5 font-light leading-loose focus:border-blue-500"
                  placeholder="Enter content..."
                  onChangeText={(text) =>
                    setPostInfo({ ...postInfo, content: text })
                  }
                />
              </View>
              <View className="flex-1">
                <CreateAttributes attrs={postAttrs} setAttrs={setPostAttrs} />
              </View>
              <View className="pt-2">
                <Btn
                  title="Update"
                  bgColor="#10316B"
                  onPress={handlePost}
                ></Btn>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
  },
});
