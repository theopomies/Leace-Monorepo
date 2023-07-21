import { View, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import { ReportModal } from "../Modal";
import BottomBar from "./BottomBar";
import Message from "./Message";
import { ContractCard } from "../Card";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamList } from "../../navigation/TabNavigator";
import { RouterInputs, trpc } from "../../../../web/src/utils/trpc";
import { UserRoles } from "../../utils/enum";

interface Message {
  content: string;
  conversationId: string;
}

export const Portal = () => {
  const route = useRoute<RouteProp<TabStackParamList, "Portal">>();

  let relationshipId = "";
  let firstName = "";
  let lastName = "";
  let image = "";
  let otherId = "";
  let leaseId = "";
  let lease = null;

  const { data: session } = trpc.auth.getSession.useQuery();

  let conversation: string | null = null;

  if (session?.role === UserRoles.TENANT) {
    const tenantQuery = trpc.relationship.getMatchesForTenant.useQuery({
      userId: session.userId,
    });

    if (tenantQuery.data && tenantQuery.data.length > 0) {
      conversation = tenantQuery.data[0]?.conversation?.id as string;
      image = tenantQuery.data[0]?.post.createdBy.image as string;
      otherId = tenantQuery.data[0]?.post.createdBy.id as string;
    }

    const leaseData = trpc.lease.getLeaseById.useQuery({
      leaseId,
    });

    if (leaseData.data) {
      lease = leaseData.data;
    }
  } else if (
    session?.role === UserRoles.OWNER ||
    session?.role === UserRoles.AGENCY
  ) {
    const ownerQuery = trpc.relationship.getMatchesForOwner.useQuery({
      userId: session.userId,
    });

    if (ownerQuery.data && ownerQuery.data.length > 0) {
      conversation = ownerQuery.data[0]?.conversation?.id as string;
      image = ownerQuery.data[0]?.post.createdBy.image as string;
      otherId = ownerQuery.data[0]?.post.createdBy.id as string;
    }
  }

  if (session?.role === UserRoles.OWNER || session?.role === UserRoles.AGENCY) {
    relationshipId = route.params.relationshipId as string;
    firstName = route.params.firstName as string;
    lastName = route.params.lastName as string;

    const getLeaseId = trpc.lease.getLeasesByUserId.useQuery({
      userId: otherId,
    });

    if (getLeaseId.data && getLeaseId.data.length > 0) {
      leaseId = getLeaseId.data[0]?.id as string;
    }

    const leaseData = trpc.lease.getLeaseById.useQuery({
      leaseId: leaseId,
    });

    if (leaseData.data) {
      lease = leaseData.data;
    }
  } else if (session?.role === UserRoles.TENANT) {
    relationshipId = route.params.relationshipId as string;
    firstName = route.params.firstName as string;
    lastName = route.params.lastName as string;

    const leaseData = trpc.lease.getLeaseById.useQuery({
      leaseId: "clkb72jv10008ibmpjktzrt9q",
    });

    if (leaseData.data) {
      lease = leaseData.data;
    }
  }

  const conversationId = conversation as string;

  const deleteLease = trpc.lease.deleteLeaseById.useMutation();

  const conv = trpc.conversation.sendMessage.useMutation();

  const signLease = trpc.lease.signLeaseById.useMutation();

  const acceptLeaseButton = async () => {
    await signLease.mutateAsync({
      leaseId: "clkb72jv10008ibmpjktzrt9q",
    });
  };

  const deleteLeaseButton = async () => {
    await deleteLease.mutateAsync({
      leaseId,
    });
  };

  const updateLeaseButton = () => {
    navigation.navigate("UpdateLease", {
      relationshipId,
      leaseId,
    });
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState({ item: "" });
  const [openReport, setOpenReport] = useState(false);

  const onSelect = (item: { item: string }) => {
    setSelected(item);

    if (item.item === "Report") {
      setSelected({ item: "Report" });
      setOpenReport(true);
    } else if (item.item === "Lease") {
      navigation.navigate("Lease", { relationshipId });
    }
  };

  const [data, setData] = useState<RouterInputs["conversation"]["sendMessage"]>(
    {
      content: "",
      conversationId,
    },
  );

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messages.length > 0) {
      const content = messages.map((message) => message.content).join(" ");
      setData((prevData) => ({
        ...prevData,
        content: content,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        content: "",
      }));
    }
  }, [messages]);

  const onChangeAttributesHandler = useCallback(
    (key: string, value: string | number | boolean | Date) => {
      setMessage(value as string);

      if (messages.length > 0) {
        const updatedMessages = messages.map((message) => ({
          ...message,
          [key]: value,
        }));

        setMessages(updatedMessages);
      } else {
        const newMessage = {
          content: value as string,
          conversationId: conversationId,
        };

        setMessages([newMessage]);
      }
    },
    [messages],
  );

  const sendMessage = async () => {
    if (!data) return;

    await conv.mutateAsync(data);

    setMessage("");
  };
  const dropdown = [
    { item: "Lease" },
    { item: "Photo & Video" },
    { item: "Document" },
    { item: "Report" },
  ];

  return (
    <>
      <View className="flex flex-1">
        <View className=" mt-10 flex flex-1">
          <View className="flex-row items-center border-b border-gray-400 bg-white p-3">
            <TouchableOpacity
              className="mr-5"
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Icon
                size={20}
                name="arrow-back-ios"
                type="material-icons"
                color={"#002642"}
                onPress={() => navigation.navigate("Dashboard")}
              />
            </TouchableOpacity>

            <Image
              source={{ uri: image }}
              className="mr-10 h-10 w-10 rounded-full"
            />
            <Text className="ml-5 flex text-center text-2xl font-bold">
              {firstName} {lastName}
            </Text>
          </View>
          <ScrollView className="">
            <View className="h-full">
              <ReportModal
                isOpened={selected.item === "Report" && openReport}
                setIsOpened={() => {
                  setOpenReport(!openReport);
                }}
                userId={otherId}
              />

              <Message
                userId={session?.userId}
                conversationId={conversationId}
                image={image}
              />

              {lease && (
                <View>
                  <View
                    className={`absolute right-0 top-0 mr-12 mt-10 ${
                      lease.isSigned ? "bg-green-500" : "bg-red-500"
                    } rounded-md p-2`}
                  >
                    <Text className={`font-bold text-white`}>
                      {lease.isSigned ? "RENTED" : "TO BE RENTED"}
                    </Text>
                  </View>
                  <ContractCard
                    rentCost={lease.rentCost as number}
                    utilitiesCost={lease.utilitiesCost as number}
                    startDate={lease.startDate as Date}
                    endDate={lease.endDate as Date}
                    deleteLease={deleteLeaseButton}
                    updateLease={updateLeaseButton}
                    acceptLease={acceptLeaseButton}
                    accepted={lease.isSigned}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <View className="flex w-full items-center justify-between p-5">
        <BottomBar
          onSendMessage={sendMessage}
          onSelect={onSelect}
          data={dropdown}
          value={message}
          handleChange={(text) => onChangeAttributesHandler("content", text)}
        />
      </View>
    </>
  );
};
