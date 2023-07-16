import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
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
  onDelete,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image: ImageSourcePropType;
  userId: string;
  relationshipId: string;
  onDelete: () => void;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this client?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDelete();
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      className="max-w-400 w-full overflow-hidden rounded-2xl border border-gray-300"
      onPress={() => {
        navigation.navigate("Portal", { userId, relationshipId, leaseId: "a" });
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
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View className="rounded-10 border-1 overflow-hidden border-gray-300" />
    </TouchableOpacity>
  );
};

export default ClientCard;
