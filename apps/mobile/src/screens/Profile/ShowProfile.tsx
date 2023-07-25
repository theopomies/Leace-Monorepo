import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { useCallback } from "react";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { TabStackParamList } from "../../navigation/TabNavigator";
import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";
import Loading from "../../components/Loading";
import { UserProfile } from "../../components/UserProfile";
import { LocalStorage } from "../../utils/cache";

export default function ShowProfile() {
  const route = useRoute<RouteProp<TabStackParamList, "Profile">>();
  const { userId } = route.params;
  const { data, isLoading, refetch } = trpc.user.getUserById.useQuery({
    userId,
  });

  useFocusEffect(
    useCallback(() => {
      const check = LocalStorage.getItem("refreshProfile");
      if (!check) return;
      LocalStorage.setItem("refreshProfile", false);
      refetch();
    }, [userId]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data && (
              <UserProfile userId={userId} data={data} editable={true} />
            )}
          </>
        )}
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    backgroundColor: "white", // #F2F7FF
  },
});
