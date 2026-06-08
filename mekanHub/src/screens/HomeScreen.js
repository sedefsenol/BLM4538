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
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();

  const [mekanlar, setMekanlar] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

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


  const openReviewDetail = (review) => {
  console.log("TIKLANAN YORUM:", review);

  const placeId = review.placeId || review.PlaceId || review.PlaceID;

  if (!placeId) {
    alert("Bu yorumda mekan id yok. Backend'den placeId gelmiyor.");
    return;
  }

  navigation.navigate("MekanDetail", {
    id: placeId,
  });
};
  const oneCikanMekanlar = mekanlar.slice(0, 5);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111" : "#f6f6f6" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#222" }]}>
        Ana Sayfa
      </Text>

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

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
        Öne Çıkan Mekanlar
      </Text>

      {oneCikanMekanlar.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.mekanCard,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
          onPress={() => openCafeDetail(item)}
        >
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: isDark ? "#2a2a2a" : "#e4efe3" },
              ]}
            >
              <Text style={styles.imageText}>Mekan Görseli</Text>
            </View>
          )}

          <Text style={[styles.mekanTitle, { color: isDark ? "#fff" : "#222" }]}>
            {item.name}
          </Text>

          <Text style={[styles.mekanDesc, { color: isDark ? "#ccc" : "#666" }]}>
            {item.location || "Adres bilgisi yok"}
          </Text>

          <View style={styles.cardBottomRow}>
            <Text style={[styles.mekanInfo, { color: isDark ? "#ccc" : "#444" }]}>
              ⭐ {puanGoster(item.averageRating)}
            </Text>

            <Text style={[styles.mekanInfo, { color: isDark ? "#ccc" : "#444" }]}>
              💬 {item.reviewCount ?? 0} yorum
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
        Son Yorumlar
      </Text>

      {latestReviews.length === 0 ? (
        <View
          style={[
            styles.commentCard,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
        >
          <Text style={[styles.commentText, { color: isDark ? "#ccc" : "#444" }]}>
            Henüz yorum bulunmuyor.
          </Text>
        </View>
      ) : (
        latestReviews.map((review) => (
  <TouchableOpacity
    key={review.id}
            style={[
              styles.commentCard,
              { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
            ]}
             onPress={() => openReviewDetail(review)}
          >
            <View style={styles.commentTopRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text
                  style={[
                    styles.commentUser,
                    { color: isDark ? "#fff" : "#222" },
                  ]}
                >
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

            <Text style={[styles.commentText, { color: isDark ? "#ccc" : "#444" }]}>
              {review.comment || "Yorum bulunmuyor."}
            </Text>

            <Text style={[styles.commentDate, { color: isDark ? "#999" : "#888" }]}>
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("tr-TR")
                : ""}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
    marginBottom: 12,
  },

  mekanCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  imagePlaceholder: {
    height: 120,
    borderRadius: 12,
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
    color: "#698a6b",
    fontWeight: "600",
  },

  mekanTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  mekanDesc: {
    fontSize: 14,
    marginBottom: 8,
  },

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  mekanInfo: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: "500",
  },

  commentCard: {
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
    lineHeight: 20,
    marginBottom: 6,
  },

  commentDate: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
});