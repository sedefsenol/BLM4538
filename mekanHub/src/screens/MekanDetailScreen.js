import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function MekanDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { isDark } = useTheme();

  const [mekan, setMekan] = useState(null);
  const [reviews, setReviews] = useState([]);

  const getMekanDetail = async () => {
    try {
      const res = await axios.get(`http://10.0.2.2:5000/api/places/${id}`);
      setMekan(res.data);

      const reviewList = res.data.reviews || res.data.comments || [];
      const sortedReviews = reviewList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReviews(sortedReviews);
    } catch (err) {
      console.log("DETAIL ERROR:", err.response?.data || err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMekanDetail();
    }, [id])
  );

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR");
  };

  const puanGoster = (puan) => {
    const sayi = Number(puan);
    return sayi > 0 ? sayi.toFixed(1) : "Henüz puan yok";
  };

  if (!mekan) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDark ? "#111" : "#f6f6f6" },
        ]}
      >
        <Text style={{ color: isDark ? "#fff" : "#222" }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111" : "#f6f6f6" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {mekan.imageUrl ? (
        <Image source={{ uri: mekan.imageUrl }} style={styles.placeImage} />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: isDark ? "#2a2a2a" : "#d9e4d8" },
          ]}
        >
          <Text style={styles.imageText}>Mekan Görseli</Text>
        </View>
      )}

      <View
        style={[
          styles.infoCard,
          { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Text style={[styles.title, { color: isDark ? "#fff" : "#222" }]}>
          {mekan.name}
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? "#bbb" : "#777" }]}>
            Konum
          </Text>
          <Text style={[styles.value, { color: isDark ? "#fff" : "#222" }]}>
            {mekan.location || "Belirtilmedi"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? "#bbb" : "#777" }]}>
            Puan
          </Text>
          <Text style={[styles.value, { color: isDark ? "#fff" : "#222" }]}>
            {puanGoster(mekan.averageRating)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigation.navigate("RatingScreen", { id: mekan.id })}
        >
          <Text style={styles.rateButtonText}>Puan Ver</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
        Yorumlar
      </Text>

      {reviews.length === 0 ? (
        <View
          style={[
            styles.emptyCommentBox,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
        >
          <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#777" }]}>
            Henüz yorum yapılmamış.
          </Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <View
            key={review.id || index}
            style={[
              styles.commentCard,
              { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
            ]}
          >
            <View style={styles.commentHeader}>
              <Text
                style={[
                  styles.commentUser,
                  { color: isDark ? "#fff" : "#222" },
                ]}
              >
                {review.fullName || review.userName || "Kullanıcı"}
              </Text>

              <Text
                style={[
                  styles.commentDate,
                  { color: isDark ? "#999" : "#777" },
                ]}
              >
                {formatDate(review.createdAt)}
              </Text>
            </View>

            <Text
              style={[
                styles.commentRating,
                { color: isDark ? "#ccc" : "#444" },
              ]}
            >
              ⭐ {Number(review.rating || 0).toFixed(1)}
            </Text>

            <Text
              style={[
                styles.commentText,
                { color: isDark ? "#ccc" : "#444" },
              ]}
            >
              {review.comment || "Yorum bulunmuyor."}
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
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeImage: {
    height: 180,
    width: "100%",
    borderRadius: 18,
    marginBottom: 16,
  },

  imagePlaceholder: {
    height: 180,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  imageText: {
    color: "#698a6b",
    fontWeight: "600",
    fontSize: 16,
  },

  infoCard: {
    borderRadius: 18,
    padding: 13,
    elevation: 3,
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  infoRow: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
  },

  rateButton: {
    backgroundColor: "#698a6b",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },

  rateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 12,
  },

  commentCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  commentUser: {
    fontSize: 15,
    fontWeight: "bold",
  },

  commentDate: {
    fontSize: 12,
  },

  commentRating: {
    fontSize: 14,
    marginBottom: 6,
  },

  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },

  emptyCommentBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },

  emptyText: {
    textAlign: "center",
  },
});