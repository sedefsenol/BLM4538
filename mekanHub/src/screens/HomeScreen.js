import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const oneCikanMekanlar = [
  {
    id: "1",
    name: "Mavi Kafe",
    desc: "Sessiz ve rahat bir ortam",
    location: "Kızılay",
    rating: "4.5",
  },
  {
    id: "2",
    name: "Yeşil Kahve",
    desc: "Kalabalık ve canlı bir mekan",
    location: "Bahçelievler",
    rating: "4.2",
  },
  {
    id: "3",
    name: "Kitap Kafe",
    desc: "Ders çalışmak için uygun",
    location: "Tunalı",
    rating: "4.8",
  },
];

const populerYorumlar = [
  {
    id: "1",
    user: "Ayşe",
    comment: "Ortamı çok sakin, ders çalışmak için gerçekten güzel bir yer.",
  },
  {
    id: "2",
    user: "Mehmet",
    comment: "Kahveleri güzel, uzun süre oturmak için uygun bir mekan.",
  },
  {
    id: "3",
    user: "Zeynep",
    comment: "Arkadaşlarla oturmak için keyifli ve canlı bir yer.",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Ana Sayfa</Text>

      <View style={styles.mapContainer}>
        <Text style={styles.mapText}>Harita Alanı</Text>
      </View>

      <Text style={styles.sectionTitle}>Öne Çıkan Mekanlar</Text>

      {oneCikanMekanlar.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.mekanCard}
          onPress={() => navigation.navigate("MekanDetail", { mekan: item })}
        >
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Mekan Görseli</Text>
          </View>

          <Text style={styles.mekanTitle}>{item.name}</Text>
          <Text style={styles.mekanDesc}>{item.desc}</Text>
          <Text style={styles.mekanInfo}>{item.location}</Text>
          <Text style={styles.mekanInfo}>⭐ {item.rating}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>En Çok Beğenilen Yorumlar</Text>

      {populerYorumlar.map((item) => (
        <View key={item.id} style={styles.commentCard}>
          <Text style={styles.commentUser}>{item.user}</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 14,
  },
  mapContainer: {
    height: 220,
    backgroundColor: "#d9e4d8",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  mapText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4d5c4c",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  mekanCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#e4efe3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imageText: {
    color: "#4d5c4c",
    fontWeight: "600",
  },
  mekanTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  mekanDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  mekanInfo: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
    fontWeight: "500",
  },
  commentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
