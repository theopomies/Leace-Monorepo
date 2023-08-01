import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { trpc } from "../../utils/trpc";
import Loading from "../../components/Loading";
import { Message, User } from "@prisma/client";

interface IMessageCard {
  data: Message & {
    sender: User;
  };
  userId: string;
}

function MessageCard({ data, userId }: IMessageCard) {
  console.log(JSON.stringify(data, null, 0));
  return (
    <View
      className={`flex h-fit ${
        userId !== data.senderId ? "items-start" : "items-end"
      } pt-1`}
    >
      <View
        className={`flex ${
          userId !== data.senderId
            ? "items-start bg-[#D3D3D3]"
            : "items-end bg-[#10316B]"
        } rounded-2xl`}
      >
        <Text
          className={`max-w-[90%] p-2 pb-0 ${
            userId !== data.senderId ? "" : "text-white"
          }`}
        >
          {data.content}
        </Text>
        <Text
          className={`pb-2 ${
            userId !== data.senderId ? "pl-2" : "pr-2 text-white"
          } pt-1 text-xs font-light italic `}
        >
          {data.createdAt.toLocaleDateString()} - {data.createdAt.getHours()}:
          {data.createdAt.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

export default function TenantChat() {
  const route = useRoute<RouteProp<TabStackParamList, "ChatTenant">>();
  const { tenantId, ownerId, role, conversationId, userId } = route.params;
  const [msg, setMsg] = useState("");

  const { data, isLoading, refetch } =
    trpc.conversation.getConversation.useQuery({
      conversationId,
    });

  const message = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      refetch();
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

  if (!data)
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Data not found</Text>
        </View>
      </View>
    );

  function sendMessage() {
    if (!msg) return;
    message.mutate({ conversationId, content: msg });
    setMsg("");
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mb-3 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        {data.messages.map((message, key) => (
          <MessageCard data={message} key={key} userId={userId} />
        ))}
      </ScrollView>
      <View style={styles.input} className="px-4">
        <TextInput
          className="rounded-full bg-[#D3D3D3] py-2 pl-4"
          placeholder="Message..."
          value={msg}
          onChangeText={(text) => setMsg(text)}
          onSubmitEditing={sendMessage}
        ></TextInput>
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
    backgroundColor: "white", // #F2F7FF
  },
  input: {
    zIndex: 10,
    paddingBottom: 10,
  },
});
