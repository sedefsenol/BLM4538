import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

export default function HomeScreen({ navigation }) {
  const [mekanlar, setMekanlar] = useState([]);


  useEffect(() => {
    axios
      .get("http://10.0.2.2:5000/api/places")
      .then((res) => setMekanlar(res.data))
      .catch((err) => console.log("API ERROR:", err));
  }, []);


  const oneCikanMekanlar = mekanlar;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Ana Sayfa</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 39.9208,
            longitude: 32.8541,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {oneCikanMekanlar.map((mekan) => (
            <Marker
              key={mekan.id}
              coordinate={{
                latitude: 39.9208, 
                longitude: 32.8541,
              }}
              title={mekan.name}
              description={mekan.description}
              onPress={() =>
                navigation.navigate("MekanDetail", { id: mekan.id })
              }
            />
          ))}
        </MapView>
      </View>

  
      <Text style={styles.sectionTitle}>Öne Çıkan Mekanlar</Text>

      {oneCikanMekanlar.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.mekanCard}
          onPress={() =>
            navigation.navigate("MekanDetail", { id: item.id })
          }
        >
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Mekan Görseli</Text>
          </View>

          <Text style={styles.mekanTitle}>{item.name}</Text>
          <Text style={styles.mekanDesc}>{item.description}</Text>

          <Text style={styles.mekanInfo}>{item.location}</Text>
          <Text style={styles.mekanInfo}>
            ⭐ {item.averageRating ?? 0}
          </Text>
          <Text style={styles.mekanInfo}>
            ({item.reviewCount ?? 0} yorum)
          </Text>
        </TouchableOpacity>
      ))}

    
      <Text style={styles.sectionTitle}>En Çok Beğenilen Yorumlar</Text>

      <View style={styles.commentCard}>
        <Text style={styles.commentUser}>Ayşe</Text>
        <Text style={styles.commentText}>
          Ortamı çok sakin, ders çalışmak için güzel.
        </Text>
      </View>

      <View style={styles.commentCard}>
        <Text style={styles.commentUser}>Mehmet</Text>
        <Text style={styles.commentText}>
          Kahveleri güzel, uzun süre oturuluyor.
        </Text>
      </View>
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
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 22,
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