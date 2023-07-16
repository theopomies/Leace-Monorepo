import React from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { trpc } from "../../../../web/src/utils/trpc";

const Message = () => {
  //     const message = trpc.conversation.sendMessage.useMutation({ conve });
  //     const [data, setData] = useState<
  //     RouterInputs["attribute"]["updatePostAttributes"]
  //   >({
  //     postId: "",
  //     location: "",
  //   });
  return (
    <>
      <View className="bg-custom mb-2 ml-2 mr-3 mt-10 h-16 w-64 self-end rounded-xl">
        <View className="h-full flex-row items-center justify-between p-2">
          <View className="w-4/5">
            <Text className="p-2 text-base text-white">Hi there!</Text>
          </View>
          <View className="flex w-1/5 flex-row items-end">
            <Icon
              name="check-all"
              type="material-community"
              size={16}
              color="#4caf50"
            />
            <Text className="text-right text-sm text-white">10:30 AM</Text>
          </View>
        </View>
      </View>
      <View className="mb-2 ml-3 mr-2 h-16 w-64 rounded-xl bg-gray-300">
        <View className="h-full flex-row items-center justify-between p-2">
          <View className="w-4/5">
            <Text className="p-2 text-base text-black">Good morning</Text>
          </View>
          <View className="flex w-1/5 flex-row items-end">
            <Icon
              name="check"
              type="material-community"
              size={16}
              color="#000000"
            />
            <Text className="text-right text-sm text-black">10:32 AM</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Message;
