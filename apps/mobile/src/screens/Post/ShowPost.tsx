import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { Report } from "../../components/Report";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import Carousel from "react-native-snap-carousel";
import Separator from "../../components/Separator";
import ShowAttributes from "../../components/Attribute/ShowAttributesRefacto";
import { Btn } from "../../components/Btn";
import { LocalStorage } from "../../utils/cache";
import { Attribute, Image as ImageDb } from "@leace/db";
import { Icon } from "react-native-elements";

export default function ShowPost() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "PostInfo">>();
  const { userId, postId, editable } = route.params;

  const {
    data: post,
    isLoading,
    refetch,
  } = trpc.post.getPostById.useQuery({ postId });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [idx, setIdx] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshPost");
      if (!check) return;
      LocalStorage.setItem("refreshPost", false);
      refetch();
    }, [userId]),
  );

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const deletePost = trpc.post.deletePostById.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshPosts", true);
      navigation.navigate("MyPosts", { userId });
    },
  });

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

  if (!post)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function _renderItem({ item, index }: { item: ImageDb; index: number }) {
    return (
      <Image
        key={index}
        className="rounded-xl"
        source={{ uri: item.ext }}
        style={{ flex: 1, resizeMode: "contain" }}
      ></Image>
    );
  }

  function handleDelete() {
    if (!post) return;
    deletePost.mutate({ postId: post.id });
  }

  interface IAttributeBtn {
    name: string;
    status: boolean | null;
    iconName: string;
    iconTextColor?: string;
    iconBGColor?: string;
  }

  function AttributeBtn({
    name,
    status,
    iconName,
    iconTextColor,
    iconBGColor,
  }: IAttributeBtn) {
    if (!status) return null;
    return (
      <View
        className="flex min-w-[150px] min-h-[50px] flex-row items-center justify-center space-x-1 rounded-lg px-2 py-1"
        style={{
          margin: 6,
          backgroundColor: iconBGColor,
        }}
      >
        <Icon
          name={iconName}
          color={iconTextColor}
          size={25}
          type="material-icons"
        ></Icon>
        <Text className="font-light" style={{ color: iconTextColor }}>
          {name}
        </Text>
      </View>
    );
  }

  function AttributesList(attribute: { attribute?: Attribute; iconBGColor?: string; iconTextColor?: string; furnished?: any; terrace?: any; pets?: any; smoker?: any; disability?: any; garden?: any; parking?: any; elevator?: any; pool?: any; }, iconTextColor: string | undefined, iconBGColor: string | undefined): React.JSX.Element {
    return <View className="mt-4 flex flex-row flex-wrap items-center justify-center space-x-2">
      <AttributeBtn
        name="Furnished"
        status={attribute.furnished}
        iconName="king-bed"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Terrace"
        status={attribute.terrace}
        iconName="deck"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Pets"
        status={attribute.pets}
        iconName="pets"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Smoker"
        status={attribute.smoker}
        iconName="smoking-rooms"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Disability"
        status={attribute.disability}
        iconName="accessible"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Garden"
        status={attribute.garden}
        iconName="local-florist"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Parking"
        status={attribute.parking}
        iconName="local-parking"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Elevator"
        status={attribute.elevator}
        iconName="elevator"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
      <AttributeBtn
        name="Pool"
        status={attribute.pool}
        iconName="pool"
        iconTextColor={iconTextColor}
        iconBGColor={iconBGColor}
      />
    </View>
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
        style={{ backgroundColor: 'white' }}
      >
        <View>
          <View className="h-80 w-full">
            {post.images.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <Carousel
                layout={"default"}
                data={post.images}
                sliderWidth={352}
                itemWidth={352}
                renderItem={_renderItem}
                onSnapToItem={(index) => setIdx(index)}
              ></Carousel>
            ) : (
              <Image
                source={{
                  uri: "https://montverde.org/wp-content/themes/eikra/assets/img/noimage-420x273.jpg",
                }}
                style={{ flex: 1, resizeMode: "cover" }}
              ></Image>
            )}
            {!editable && (
              <Report
                className="absolute bottom-0 right-4 flex flex-row items-center space-x-2 rounded-br-md rounded-tl-md bg-red-500 p-2.5"
                type="POST"
                postId={post.id}
              />
            )}
          </View>
          <View className="mx-6 mt-2">
            <Text className="text-2xl font-bold text-black">{post.title}</Text>
            <Text className=" text-xl font-light text-black">
              {(post.attribute?.size ?? '-') + " m² - "}
              {(post.attribute?.location ?? "No location") + " - " + capitalize(post.attribute?.homeType?.toLowerCase() ?? "No type")}
            </Text>

            <View>
              {/* <View className="flex flex-row">
                <Text className="min-w-[68px] font-bold text-white">Type:</Text>
                <Text className="font-light text-white">
                  {capitalize(post.attribute?.homeType?.toLowerCase() ?? "No type")}
                </Text>
              </View> */}
              {/* <View className="flex flex-row">
                <Text className=" min-w-[68px] font-bold text-white">
                Size:
                </Text>
                <Text className="font-light text-white">
                {post.attribute?.size} m²
                </Text>
              </View> */}
              {/* <View className="flex flex-row">
                <Text className=" min-w-[68px] font-bold text-white">
                Price:
                </Text>
                <Text className="font-light text-white">
                {post.attribute?.price} €
                </Text>
              </View> */}
              <Text className="text-xl font-light text-black">
                <Text className="font-bold text-xl" >
                  {post.attribute?.price} €
                </Text>
                /month
              </Text>
              <View className="flex flex-row mt-4">
                <Text className="min-w-[68px] text-xl text-black">
                  {'Available from '}
                </Text>
                <Text className="font-bold text-xl text-black">
                  {post.attribute?.rentStartDate?.toDateString()}
                </Text>
              </View>
              <View className="mb-3 flex flex-row">
                <Text className=" text-black text-xl">Created: </Text>
                <Text className="font-bold text-black text-xl">{post.createdAt.toDateString()}</Text>
              </View>

              {/* <View className="flex flex-row">
                <Text className="min-w-[68px] font-bold text-white">
                Available:
                </Text>
                <Text className="font-light text-white">
                {post.attribute?.rentStartDate?.toDateString()}
                </Text>
              </View> */}
            </View>


            {/* <Text className=" text-lg font-light text-white">
              {post.desc}
            </Text> */}

            <View className="my-3 mt-6 h-24 w-full border-2 border-gray  rounded-xl p-2">
              <Text className="text-lg font-base">{post.desc}</Text>
            </View>

            {post.attribute && (
              <>
                {/* <ShowAttributes
                  attribute={post.attribute}
                  iconBGColor="#6C47FF"
                  iconTextColor="#F2F7FF"
                  titleColor="#FFFFFF"
                  show={true}
                ></ShowAttributes> */}
                {
                  AttributesList(post.attribute, "white", "#6C47FF")
                }
              </>
            )}
            <Separator color="black" />
            {!editable && (
              <>
                <View className="flex flex-row justify-between mt-3">
                  <View className="flex flex-row">
                    <Image
                      source={{
                        uri:
                          post.createdBy.image ??
                          "https://www.gravatar.com/avatar/?d=mp",
                      }}
                      className=" h-16 w-16 rounded-full"
                      style={{ borderWidth: 2, borderColor: "gray" }}
                    />
                    <View className="flex justify-center pl-3">
                      <Text className="text-xl font-bold text-black">
                        {post.createdBy.firstName}
                      </Text>
                      <Text className="text-black ">
                        {post.createdBy.lastName}
                      </Text>
                    </View>
                  </View>
                  <View className="flex items-center justify-center">
                    <Btn
                      title="View Profile"
                      bgColor="#6C47FF"
                      textColor="#F2F7FF"
                    ></Btn>
                  </View>
                </View>
              </>
            )}
          </View>

        </View>
        <View className="px-4">
          {editable && (
            <>
              <Separator color="black" />
              <View>
                <Btn
                  title="Reviews"
                  bgColor="#F2F7FF"
                  textColor="#6C47FF"
                  onPress={() => navigation.navigate("PostReviews")}
                ></Btn>
              </View>
              <View className="pt-1.5">
                <Btn
                  title="Edit"
                  bgColor="#F2F7FF"
                  textColor="#6C47FF"
                  onPress={() => {
                    navigation.navigate("EditPost", {
                      userId,
                      data: JSON.stringify(post),
                    });
                  }}
                ></Btn>
              </View>
              <View className="pt-1.5">
                <Btn
                  title="Delete"
                  bgColor="#EF4444"
                  onPress={handleDelete}
                ></Btn>
              </View>
            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    flex: 1,
    backgroundColor: "white",
  },
});
