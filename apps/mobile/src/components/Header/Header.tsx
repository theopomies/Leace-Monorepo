import { View, Image, StyleSheet } from "react-native";
import React from "react";

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        className="mt-1 h-14 w-14"
        source={require("../../../assets/logo.png")}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: 54,
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 1,
    zIndex: 10,
  },
});
