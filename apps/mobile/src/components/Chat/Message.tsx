import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Image } from "react-native-elements";
import { Loading } from "../Loading";
import { trpc } from "../../../../web/src/utils/trpc";

const Message = ({
  userId,
  conversationId,
  image,
}: {
  userId: string | undefined;
  conversationId: string;
  image: string;
}) => {
  const convQuery = trpc.conversation.getConversation.useQuery({
    conversationId,
  });

  const conv = convQuery.data;

  useEffect(() => {
    // convQuery.refetch();
  }, [convQuery.data]);

  if (convQuery.isLoading) {
    return <Loading />;
  }

  if (convQuery.isError) {
    return <Text>Error loading messages</Text>;
  }

  return (
    <View className="flex h-full w-full flex-auto flex-col p-6">
      <View className="flex h-full w-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
        <View className="flex h-full w-full flex-col overflow-auto">
          <View className="flex h-full flex-col">
            {conv &&
              conv.messages.map((message) => (
                <View key={message.id} className="grid grid-cols-12 gap-y-2">
                  {message.senderId === userId ? (
                    <View className="col-start-6 col-end-13 rounded-lg p-3">
                      <View className="flex flex-row-reverse items-center justify-start">
                        <View className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
                          <Image
                            source={{ uri: image }}
                            className="mx-auto  h-10 w-10 rounded-full"
                          />
                        </View>
                        <Text className="mr-3 flex w-fit break-words rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow">
                          {message.content}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="col-start-1 col-end-8 rounded-lg p-3">
                      <View className="flex flex-row items-center">
                        <View className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
                          <Image
                            source={{ uri: image }}
                            className="mx-auto h-10 w-10 rounded-full"
                          />
                        </View>
                        <Text className="ml-3 flex w-fit break-words rounded-xl bg-white px-4 py-2 text-sm shadow">
                          {message.content}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Message;
