import {
  View,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { IDefaulAttributes } from "../../types";
import Separator from "../../components/Separator";
import { CreateAttributes } from "../../components/Attribute";
import { Btn } from "../../components/Btn";

export default function CreatePost() {
  const [postInfo, setPostInfo] = useState({
    title: "",
    desc: "",
    content: "",
  });
  const [postAttrs, setPostAttrs] = useState<IDefaulAttributes | undefined>({
    postId: "",
    location: "",
    price: 0,
    size: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });
  const post = trpc.post.createPost.useMutation({});

  const attributes = trpc.attribute.updatePostAttributes.useMutation({});

  async function createPost() {
    const response = await post.mutateAsync(postInfo);
    attributes.mutate({ ...postAttrs, postId: response.id });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "white" }} // #F2F7FF
        >
          <View className="flex-1 space-y-2 p-4">
            <View>
              <Text className="text-base font-bold text-[#10316B]">Tittle</Text>
              <TextInput
                className="border-b border-[#D3D3D3] py-1.5 font-light leading-loose focus:border-blue-500"
                placeholder="Enter title..."
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
                title="Create Post"
                bgColor="#10316B"
                onPress={createPost}
              ></Btn>
            </View>
          </View>
        </ScrollView>
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F2F7FF",
  },
});
