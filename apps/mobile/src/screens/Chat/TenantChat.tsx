import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/RootNavigator";
import { trpc } from "../../utils/trpc";
import { Loading } from "../../components/Loading";
import { Message, User, Lease } from "@prisma/client";
import { Btn } from "../../components/Btn";
import { Report } from "../../components/Report";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LocalStorage } from "../../utils/cache";

interface IMessageCard {
  data: Message & {
    sender: User;
  };
  userId: string;
}

function MessageCard({ data, userId }: IMessageCard) {
  return (
    <View
      className={`flex h-fit ${
        userId !== data.senderId ? "items-start" : "items-end"
      } pt-1`}
    >
      <View
        className={`flex ${
          userId !== data.senderId
            ? "items-start bg-[#ececec]"
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
          className={`px-2 pb-2 ${
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
  const navigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();

  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const route = useRoute<RouteProp<TabStackParamList, "ChatTenant">>();
  const {
    tenantId,
    ownerId,
    role,
    conversationId,
    userId,
    lease: oldLease,
    relationshipId,
  } = route.params;

  const [lease, setLease] = useState<Lease>({
    id: "",
    relationshipId: "",
    isSigned: false,
    rentCost: 0,
    utilitiesCost: 0,
    startDate: new Date(),
    endDate: new Date(),
    createdById: "",
  });

  const [msg, setMsg] = useState("");

  const { data, isLoading, refetch } =
    trpc.conversation.getConversation.useQuery({
      conversationId,
    });

  const { refetch: leaseRefetch } = trpc.lease.getLeaseById.useQuery(
    { leaseId: oldLease?.id ?? "" },
    {
      enabled: false,
      onSuccess(data) {
        setLease(data);
      },
    },
  ); // !!oldLease?.id ??""

  const message = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const createLease = trpc.lease.createLease.useMutation({
    onSuccess(data) {
      LocalStorage.setItem("refreshMatches", true);
      setLease(() => ({ ...data }));
      setShow(false);
    },
  });
  const updateLease = trpc.lease.updateLeaseById.useMutation({
    onSuccess() {
      LocalStorage.setItem("refreshMatches", true);

      setShow(false);
    },
  });
  const signLease = trpc.lease.signLeaseById.useMutation({
    onSuccess() {
      setShow(false);
    },
  });

  const canSignContract = () => {
    if (role === "TENANT" && lease?.id !== "") {
      setShow(true);
    } else {
      if (role === "TENANT") {
        Alert.alert(
          "No lease created yet",
          "Please wait for the owner to create the lease.",
        );
      } else {
        setShow(true);
      }
    }
  };

  useEffect(() => {
    const yourFunction = () => {
      if (refetch) {
        refetch();
      }
    };
    leaseRefetch();
    const intervalId = setInterval(yourFunction, 1000);
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("Screen focused");
    });
    const unsubscribeBlur = navigation.addListener("blur", () => {
      clearInterval(intervalId);
    });
    return () => {
      console.log("Component unmounted, clearing interval");
      clearInterval(intervalId);
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

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

  async function handleLease() {
    if (role === "TENANT" && lease && !lease.isSigned) {
      console.log(lease);
      signLease.mutate({ leaseId: lease.id });
      setLease({ ...lease, isSigned: true });
      return;
    }
    if (!lease.id) {
      createLease.mutate({
        relationshipId,
        rentCost: lease.rentCost,
        utilitiesCost: lease.utilitiesCost,
        startDate: lease.startDate,
        endDate: lease.endDate,
      });
    } else
      updateLease.mutate({
        leaseId: lease.id,
        rentCost: lease.rentCost,
        utilitiesCost: lease.utilitiesCost,
        startDate: lease.startDate,
        endDate: lease.endDate,
      });
  }

  return (
    <>
      <DateTimePickerModal
        isVisible={open}
        date={lease.startDate}
        mode={"date"}
        onConfirm={(date) => {
          setOpen(false);
          setLease({ ...lease, startDate: date });
        }}
        onCancel={() => setOpen(false)}
      />
      <DateTimePickerModal
        isVisible={open1}
        date={lease.endDate}
        mode={"date"}
        onConfirm={(date) => {
          setOpen1(false);
          setLease({ ...lease, endDate: date });
        }}
        onCancel={() => setOpen1(false)}
      />
      <SafeAreaView
        className="flex-1 bg-white pb-1"
        style={{ borderTopWidth: 1, borderColor: "#D3D3D3" }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View className="flex-1 items-center justify-center">
            <View
              className="w-3/4 rounded-md bg-white p-4"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View className="flex space-y-2">
                <Text className="text-center text-lg font-bold">Lease</Text>
                <View className="flex flex-row items-center justify-between px-2">
                  <Text className="text-base font-bold text-[#394867]">
                    Rent Cost:
                  </Text>
                  <TextInput
                    editable={role !== "TENANT"}
                    className="font-light text-black"
                    inputMode="decimal"
                    placeholder="0123456789"
                    defaultValue={lease.rentCost.toString()}
                    onChangeText={(text) => {
                      if (isNaN(parseInt(text))) return;
                      setLease({ ...lease, rentCost: parseInt(text) });
                    }}
                  />
                </View>
                <View className="flex flex-row items-center justify-between px-2">
                  <Text className="text-base font-bold text-[#394867]">
                    Utilities Cost:
                  </Text>
                  <TextInput
                    editable={role !== "TENANT"}
                    className="font-light text-black"
                    inputMode="decimal"
                    placeholder="0123456789"
                    defaultValue={lease.utilitiesCost.toString()}
                    onChangeText={(text) => {
                      if (isNaN(parseInt(text))) return;
                      setLease({ ...lease, utilitiesCost: parseInt(text) });
                    }}
                  />
                </View>
                <View className="flex flex-row items-center justify-between px-2">
                  <Text className="text-base font-bold text-[#394867]">
                    Start date:
                  </Text>
                  <TouchableOpacity
                    disabled={role === "TENANT"}
                    onPress={() => setOpen(true)}
                  >
                    <Text className="font-light">
                      {lease.startDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex flex-row items-center justify-between px-2">
                  <Text className="text-base font-bold text-[#394867]">
                    End date:
                  </Text>
                  <TouchableOpacity
                    disabled={role === "TENANT"}
                    onPress={() => setOpen1(true)}
                  >
                    <Text className="font-light">
                      {lease.endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-3 flex space-y-1">
                  {role !== "TENANT" && !lease.isSigned && (
                    <View>
                      <Btn
                        title={!lease.id ? "Create lease" : "Update Lease"}
                        bgColor="#38a169"
                        onPress={handleLease}
                      ></Btn>
                    </View>
                  )}
                  {role === "TENANT" && (
                    <View>
                      <Btn
                        title={!lease.isSigned ? "Sign Lease" : "Signed"}
                        bgColor={!lease.isSigned ? "#38a169" : "#73bd96"}
                        onPress={!lease.isSigned ? handleLease : undefined}
                      ></Btn>
                    </View>
                  )}
                  {role !== "TENANT" && lease.isSigned && (
                    <View>
                      <Btn
                        title={"Signed"}
                        bgColor={"#73bd96"}
                        onPress={undefined}
                      ></Btn>
                    </View>
                  )}
                  <View>
                    <Btn
                      title="Close"
                      bgColor="#F2F7FF"
                      textColor="#0A2472"
                      onPress={() => setShow(false)}
                    ></Btn>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
          className="mb-3 px-4"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {data.messages.map((message, key) => (
            <MessageCard data={message} key={key} userId={userId} />
          ))}
        </ScrollView>
        <View
          style={styles.input}
          className="flex h-12 flex-row items-center space-x-1 px-4"
        >
          <View className="flex-1">
            <TextInput
              className="rounded-full bg-[#ececec] py-2 pl-4"
              placeholder="Message..."
              value={msg}
              onChangeText={(text) => setMsg(text)}
              onSubmitEditing={sendMessage}
            ></TextInput>
          </View>
          {role !== "TENANT" && (
            <View>
              <Report
                type="USER"
                className="rounded-full bg-red-500 p-2.5"
                userId={role === "OWNER" ? tenantId : ownerId}
              />
            </View>
          )}
          <View>
            <Btn
              iconName="description"
              iconType="material"
              bgColor="#6366f1"
              className="rounded-full"
              onPress={() => {
                canSignContract();
              }}
            ></Btn>
          </View>
        </View>
      </SafeAreaView>
    </>
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
  input: {
    zIndex: 10,
  },
});
