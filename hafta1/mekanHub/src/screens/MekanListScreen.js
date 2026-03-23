import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MekanListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mekanların listesi bulunacak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});