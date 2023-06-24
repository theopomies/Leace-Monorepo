import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ClientCard = ({
  firstName,
  lastName,
  email,
  image,
  userId,
  relationshipId,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: ImageSourcePropType;
  userId: string;
  relationshipId: string;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  return (
    <TouchableOpacity
      className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
      onPress={() => {
        navigation.navigate("Portal", { userId, relationshipId });
      }}
    >
      <View className="flex-row items-center p-2">
        <Image source={image} className="mr-10 h-20 w-20 rounded-full" />
        <View className="flex-1">
          <Text className="text-18 mb-5 font-bold">
            {firstName} {lastName}
          </Text>
          <Text className="text-14 mb-5 text-gray-600">{email}</Text>
        </View>
      </View>
      <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
    </TouchableOpacity>
  );
};

export default ClientCard;
