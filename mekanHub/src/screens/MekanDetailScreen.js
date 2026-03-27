import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MekanDetailScreen({ route }) {
  const { mekan } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Mekan Görseli</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{mekan.name}</Text>
        <Text style={styles.desc}>{mekan.desc || "Açıklama bulunmuyor."}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Konum</Text>
          <Text style={styles.value}>{mekan.location || "Belirtilmedi"}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Puan</Text>
          <Text style={styles.value}>{mekan.rating || "-"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 16,
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: "#d9e4d8",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imageText: {
    color: "#4d5c4c",
    fontWeight: "600",
    fontSize: 16,
  },
  contentBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#666",
    marginBottom: 18,
    lineHeight: 22,
  },
  infoBox: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
  },
});