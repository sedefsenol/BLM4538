import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

export default function HomeScreen({ navigation }) {
  const [mekanlar, setMekanlar] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);

  const API_URL = "http://10.0.2.2:5000";

  const cafeMi = (item) => {
    const text = `${item.name || ""} ${item.description || ""} ${
      item.location || ""
    }`.toLowerCase();

    const cafeKelimeleri =
      text.includes("cafe") ||
      text.includes("café") ||
      text.includes("kahve") ||
      text.includes("coffee") ||
      text.includes("starbucks");

    const istenmeyenler =
      text.includes("hotel") ||
      text.includes("otel") ||
      text.includes("apart") ||
      text.includes("pansiyon") ||
      text.includes("suite");

    return cafeKelimeleri && !istenmeyenler;
  };

  const puanGoster = (puan) => {
    const sayi = Number(puan);
    return sayi > 0 ? sayi.toFixed(1) : "Henüz puan yok";
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/places/nearby-cafes?lat=39.9334&lng=32.8597`)
      .then((res) => {
        const sadeceCafeler = res.data.filter(cafeMi);
        setMekanlar(sadeceCafeler);
      })
      .catch((err) => console.log("API ERROR:", err));

    axios
      .get(`${API_URL}/api/reviews/latest`)
      .then((res) => setLatestReviews(res.data.slice(0, 5)))
      .catch((err) => console.log("LATEST REVIEWS ERROR:", err));

    axios
      .get(`${API_URL}/api/reviews/popular-places`)
      .then((res) => {
        const sadeceCafeler = res.data.filter(cafeMi);
        setPopularPlaces(sadeceCafeler.slice(0, 5));
      })
      .catch((err) => console.log("POPULAR PLACES ERROR:", err));
  }, []);

  const openCafeDetail = async (mekan) => {
    try {
      const res = await axios.post(`${API_URL}/api/places/google-save`, {
        name: mekan.name,
        location: mekan.location,
        description: mekan.description,
        averageRating: 0,
        latitude: mekan.latitude,
        longitude: mekan.longitude,
        googlePlaceId: mekan.googlePlaceId || mekan.id,
        imageUrl: mekan.imageUrl,
      });

      navigation.navigate("MekanDetail", {
        id: res.data.id,
      });
    } catch (error) {
      console.log("OPEN CAFE ERROR:", error.response?.data || error.message);
    }
  };

  const oneCikanMekanlar = mekanlar.slice(0, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Ana Sayfa</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 39.7904,
            longitude: 32.809,
            latitudeDelta: 0.45,
            longitudeDelta: 0.45,
          }}
        >
          {mekanlar.map((mekan) => (
            <Marker
              key={mekan.id}
              coordinate={{
                latitude: mekan.latitude || 39.9208,
                longitude: mekan.longitude || 32.8541,
              }}
              title={mekan.name}
              description={mekan.location}
              onPress={() => openCafeDetail(mekan)}
            />
          ))}
        </MapView>
      </View>

      <Text style={styles.sectionTitle}>Öne Çıkan Mekanlar</Text>

      {oneCikanMekanlar.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.mekanCard}
          onPress={() => openCafeDetail(item)}
        >
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Mekan Görseli</Text>
            </View>
          )}

          <Text style={styles.mekanTitle}>{item.name}</Text>

          <Text style={styles.mekanDesc}>
            {item.location || "Adres bilgisi yok"}
          </Text>

          <View style={styles.cardBottomRow}>
            <Text style={styles.mekanInfo}>
              ⭐ {puanGoster(item.averageRating)}
            </Text>

            <Text style={styles.mekanInfo}>
              💬 {item.reviewCount ?? 0} yorum
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Son Yorumlar</Text>

      {latestReviews.length === 0 ? (
        <View style={styles.commentCard}>
          <Text style={styles.commentText}>Henüz yorum bulunmuyor.</Text>
        </View>
      ) : (
        latestReviews.map((review) => (
          <View key={review.id} style={styles.commentCard}>
            <View style={styles.commentTopRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.commentUser}>
                  {review.fullName || review.userName || "Kullanıcı"}
                </Text>

                <Text style={styles.commentPlace}>
                  {review.placeName || "Mekan adı yok"}
                </Text>
              </View>

              <Text style={styles.commentRating}>
                ⭐ {Number(review.rating || 0).toFixed(1)}
              </Text>
            </View>

            <Text style={styles.commentText}>
              {review.comment || "Yorum bulunmuyor."}
            </Text>

            <Text style={styles.commentDate}>
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("tr-TR")
                : ""}
            </Text>
          </View>
        ))
      )}
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

  map: {
    width: "100%",
    height: "100%",
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

  cardImage: {
    height: 120,
    width: "100%",
    borderRadius: 12,
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

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
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

  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  commentPlace: {
    fontSize: 13,
    color: "#698a6b",
    fontWeight: "600",
    marginTop: 2,
  },

  commentRating: {
    fontSize: 14,
    color: "#222",
    fontWeight: "bold",
    backgroundColor: "#e4efe3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  commentText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 6,
  },

  commentDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    textAlign: "right",
  },
});