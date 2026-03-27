import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>U</Text>
      </View>

      <Text style={styles.name}>Kullanıcı</Text>
      <Text style={styles.email}>kullanici@email.com</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Favori Mekanlar</Text>
        <Text style={styles.infoValue}>5 mekan kaydedildi</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Yorumlarım</Text>
        <Text style={styles.infoValue}>3 yorum yapıldı</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#698a6b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  email: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
    marginBottom: 24,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 18,
    color: "#222",
    fontWeight: "600",
  },
});