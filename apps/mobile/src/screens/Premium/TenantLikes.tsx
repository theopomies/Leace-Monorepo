import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";
import { trpc } from "../../../../web/src/utils/trpc";
import { SafeAreaView } from "react-native-safe-area-context";

const TenantLikes = ({ callback }: { callback: () => void }) => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const payment = trpc.stripe.cancelPayment.useMutation();

  const updateStatus = async () => {
    payment
      .mutateAsync({
        userId: session?.userId as string,
      })
      .then(() => {
        callback();
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          You are now a premium member. To cancel your subscription, click below
        </Text>
        <TouchableOpacity onPress={updateStatus} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel Premium</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TenantLikes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 35,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
