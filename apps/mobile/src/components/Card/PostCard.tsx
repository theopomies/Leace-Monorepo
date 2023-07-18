import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const PostCard = ({
  title,
  desc,
  content,
  income,
  expenses,
  postId,
}: {
  title: string | null;
  desc: string | null;
  content: string | null;
  income: number | undefined;
  expenses: number | undefined;
  postId: string;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <TouchableOpacity
      className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
      onPress={() => navigation.navigate("PostDetails", { postId })}
    >
      <View className="flex-row items-center p-2">
        <Image
          source={require("../../../assets/appart.jpg")}
          className="mr-10 h-20 w-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-18 mb-2 font-bold">{title}</Text>
          <Text className="text-14 mb-2 text-gray-600">{desc}</Text>
          <Text className="text-16">{content}</Text>
          {income !== undefined ? (
            <View className="flex-row">
              <Text className="text-14 mr-2 font-bold">Income:</Text>
              <Text className="text-14">{income}</Text>
            </View>
          ) : null}
          {expenses !== undefined ? (
            <View className="flex-row">
              <Text className="text-14 mr-2 font-bold">Expenses:</Text>
              <Text className="text-14">{expenses}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
    </TouchableOpacity>
  );
};

export default PostCard;
