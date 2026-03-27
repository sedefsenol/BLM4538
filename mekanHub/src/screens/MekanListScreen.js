import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

const mekanlar = [
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
  {
    id: "4",
    name: "Sahil Cafe",
    desc: "Manzaralı oturma alanı",
    location: "Çayyolu",
    rating: "4.1",
  },
  {
    id: "5",
    name: "Kampüs Kahve",
    desc: "Öğrenciler için uygun fiyatlı",
    location: "Beşevler",
    rating: "4.6",
  },
];

export default function MekanListScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const filteredMekanlar = useMemo(() => {
    return mekanlar.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate("MekanDetailSearch", { mekan: item })}
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDesc}>{item.desc}</Text>
      <View style={styles.itemBottom}>
        <Text style={styles.itemInfo}>{item.location}</Text>
        <Text style={styles.itemInfo}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Mekan Ara</Text>

      <TextInput
        style={styles.input}
        placeholder="Mekan ismi yaz..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredMekanlar}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aramaya uygun mekan bulunamadı.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
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
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    elevation: 2,
    color: "#222",
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemInfo: {
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
    fontSize: 16,
  },
});