import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
const reviews = [
  {
    name: "John Doe",
    image:
      "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1600",
    notes:
      "The owner is fantastic! They ensure that the apartment has a beautiful view and is always very clean and well-maintained. Highly recommended.",
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
      "I couldn't ask for a better owner! The location is fantastic, close to amenities and public transport. Highly recommended.",
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
      "The owner is responsive and attentive. The apartment is spacious and cozy, situated in a great neighborhood with friendly neighbors.",
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
      "The owner is great! While the apartment is a bit small, it's well-designed and feels comfortable. Responsive landlord.",
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
      "I appreciate the owner's effort in maintaining a quiet and peaceful environment. Perfect for someone looking for a serene place.",
    rating: 4,
    accountId: "112",
    postId: "123",
    createdAt: new Date(),
  },
  {
    name: "Chris Brown",
    image:
      "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1600",
    notes:
      "Good value for the rent. Responsive landlord and maintenance team. Recommended!",
    rating: 3,
    accountId: "123",
    postId: "134",
    createdAt: new Date(),
  },
  {
    name: "Olivia White",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600",
    notes:
      "The owner has created a modern and stylish space. Love the community vibe. Great experience!",
    rating: 4.5,
    accountId: "134",
    postId: "145",
    createdAt: new Date(),
  },
  {
    name: "Michael Black",
    image:
      "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=600",
    notes:
      "The owner provides a great location for professionals. Convenient to workplaces and restaurants. A five-star experience!",
    rating: 5,
    accountId: "145",
    postId: "156",
    createdAt: new Date(),
  },
  {
    name: "Sophia Green",
    image:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=300",
    notes:
      "Responsive and friendly property management. The owner is always quick to address concerns. I feel well taken care of.",
    rating: 4,
    accountId: "156",
    postId: "167",
    createdAt: new Date(),
  },
  {
    name: "Daniel Taylor",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    notes:
      "The owner ensures well-maintained common areas. I'm enjoying the gym and communal spaces. Great landlord!",
    rating: 3.5,
    accountId: "167",
    postId: "178",
    createdAt: new Date(),
  },
  {
    name: "Ava Anderson",
    image:
      "https://images.pexels.com/photos/4065187/pexels-photo-4065187.jpeg?auto=compress&cs=tinysrgb&w=300",
    notes:
      "The owner provides a beautiful sunrise view from the apartment. The atmosphere is cozy and inviting. Highly recommended!",
    rating: 4,
    accountId: "178",
    postId: "189",
    createdAt: new Date(),
  },
  {
    name: "Matthew Miller",
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300",
    notes:
      "Affordable rent for the area. Well-equipped kitchen and spacious living room. The owner is responsive and accommodating.",
    rating: 3,
    accountId: "189",
    postId: "190",
    createdAt: new Date(),
  },
  {
    name: "Isabella Harris",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    notes:
      "The owner fosters a friendly environment with pet-friendly policies. Enjoying my time here!",
    rating: 4.5,
    accountId: "190",
    postId: "201",
    createdAt: new Date(),
  },
  {
    name: "James Wilson",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300",
    notes:
      "Safe and secure neighborhood provided by the owner. Close to parks for outdoor activities. Excellent landlord!",
    rating: 5,
    accountId: "201",
    postId: "212",
    createdAt: new Date(),
  },
];

function Card({
  review,
}: {
  review: { image: string; notes: string; name: string; rating: number };
}) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={i <= review.rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </Text>,
      );
    }
    return stars;
  };

  return (
    <View className={"px-2 pb-2"}>
      <View className="flex-row items-center rounded-md border border-[#d3d3d3] p-2">
        <Image
          source={{ uri: review.image }}
          className={"mr-4 h-12 w-12 rounded-full"}
        />
        <View className={"flex-1"}>
          <Text className={"text-lg font-bold"}>{review.name}</Text>
          <Text className={"mb-2 text-base"}>{review.notes}</Text>
          <View className={"flex-row"}>{renderStars()}</View>
        </View>
      </View>
    </View>
  );
}

const OverallRating = () => {
  const calculateOverallRating = () => {
    if (reviews.length === 0) {
      return 0; // Default to 0 if there are no reviews to prevent NaN
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const renderOverallStars = () => {
    const overallRating = calculateOverallRating();
    const roundedRating = Math.round(overallRating * 10) / 10; // Round to one decimal place

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={i <= roundedRating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </Text>,
      );
    }

    return (
      <View className={"flex-row items-center gap-1"}>
        {stars}
        <Text className={""}>{roundedRating}</Text>
      </View>
    );
  };

  return (
    <View
      className={"flex flex-row items-center justify-between px-2 py-2"}
      style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}
    >
      <Text className={"text-lg font-bold"}>Overall Rating</Text>
      {renderOverallStars()}
    </View>
  );
};

export default function UsersReviews() {
  /*const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const route = useRoute<RouteProp<TabStackParamList, "PostReviews">>();*/
  const [selectedType, setSelectedType] = useState("");
  const [posts, setPosts] = useState(reviews);

  function handlePicker(value: string) {
    setSelectedType(value);
    if (value === "HIGHEST") {
      const tmp = reviews.slice().sort((a, b) => b.rating - a.rating);
      setPosts([...tmp]);
    } else if (value === "LOWEST") {
      const tmp = reviews.slice().sort((a, b) => a.rating - b.rating);
      setPosts([...tmp]);
    } else setPosts([...reviews]);
  }

  return (
    <View className="flex-1 bg-white">
      <OverallRating />
      <View style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 0.2 }}>
        <Picker
          selectedValue={selectedType}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onValueChange={(itemValue, itemIndex) => {
            handlePicker(itemValue);
          }}
        >
          <Picker.Item label="All" value="ALL" />
          <Picker.Item label="Highest" value="HIGHEST" />
          <Picker.Item label="Lowest" value="LOWEST" />
        </Picker>
      </View>
      <ScrollView className="pb-4 pt-2">
        {posts.map((review, key) => (
          <Card review={review} key={key} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  starFilled: {
    color: "gold",
    fontSize: 18,
  },
  starEmpty: {
    color: "gray",
    fontSize: 18,
  },
});