import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import { UserProfile } from "../../components/UserProfile";
import { LocalStorage } from "../../utils/cache";
import { Icon } from "react-native-elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function ShowProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const { data, isLoading, refetch } = trpc.user.getUserById.useQuery({
    userId,
  });

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshProfile");
      if (!check) return;
      LocalStorage.setItem("refreshProfile", false);
      refetch();
    }, [userId]),
  );

  if (isLoading)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Loading />
        </View>
      </View>
    );

  if (!data)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  const review = [
    {
      name: "John Doe",
      image:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1600",
      notes:
        "Lovely apartment with a beautiful view. Very clean and well-maintained.",
      rating: 4.5,
      accountId: "123",
      postId: "456",
      createdAt: new Date(),
    },
    {
      name: "Jane Smith",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600",
      notes:
        "Fantastic location! Close to amenities and public transport. Highly recommended.",
      rating: 5,
      accountId: "456",
      postId: "789",
      createdAt: new Date(),
    },
    {
      name: "Alice Johnson",
      image:
        "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1600",
      notes:
        "Spacious and cozy apartment. Great neighborhood with friendly neighbors.",
      rating: 4,
      accountId: "789",
      postId: "101",
      createdAt: new Date(),
    },
    {
      name: "Bob Williams",
      image:
        "https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=300",
      notes:
        "The apartment is a bit small, but its well-designed and feels comfortable.",
      rating: 3.5,
      accountId: "101",
      postId: "112",
      createdAt: new Date(),
    },
    {
      name: "Eva Davis",
      image:
        "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=1600",
      notes:
        "Quiet and peaceful environment. Perfect for someone looking for a serene place.",
      rating: 4,
      accountId: "112",
      postId: "123",
      createdAt: new Date(),
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={i <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </Text>,
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        <UserProfile
          userId={userId}
          data={data}
          editable={true}
          showAttrs={data.role === "TENANT" ? true : false}
          showLogout={true}
        />
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {review.map((a, key) => (
              <View
                className={"flex h-20 items-center justify-center px-2"}
                key={key}
              >
                <View className="flex-row items-center rounded-md border border-[#d3d3d3] p-2">
                  <Image
                    source={{ uri: a.image }}
                    className={"mr-4 h-12 w-12 rounded-full"}
                  />
                  <View className={"flex-1"}>
                    <Text className={"font-bold"}>{a.name}</Text>
                    <View className={"flex-row"}>{renderStars(a.rating)}</View>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity
              className="flex h-20 w-20 items-center justify-center"
              onPress={() => navigation.navigate("UsersReviews")}
            >
              <View className="border-indigo flex h-9 w-9 items-center justify-center rounded-full border">
                <Icon
                  name="add"
                  type="material-icons"
                  color={"rgb(99,102,241)"}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  view: { flex: 1, backgroundColor: "white" },
  scrollViewContent: {
    flexDirection: "row", // Horizontal layout
  },
  block: {
    width: 100,
    height: 100,
    backgroundColor: "blue", // You can customize the color as needed
    margin: 10, // Adjust the margin as needed
  },
  starFilled: {
    color: "gold",
    fontSize: 18,
  },
  starEmpty: {
    color: "gray",
    fontSize: 18,
  },
});
