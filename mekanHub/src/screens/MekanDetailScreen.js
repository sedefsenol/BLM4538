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

export default function MekanDetailScreen({ route, navigation }) {
  const { id } = route.params;

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

  if (!mekan) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {mekan.imageUrl ? (
        <Image source={{ uri: mekan.imageUrl }} style={styles.placeImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Mekan Görseli</Text>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.title}>{mekan.name}</Text>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Konum</Text>
          <Text style={styles.value}>{mekan.location || "Belirtilmedi"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Puan</Text>
          <Text style={styles.value}>
  {mekan.averageRating > 0 ? mekan.averageRating : "Henüz puan yok"}
</Text>
        </View>

       

        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigation.navigate("RatingScreen", { id: mekan.id })}
        >
          <Text style={styles.rateButtonText}>Puan Ver</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Yorumlar</Text>

      {reviews.length === 0 ? (
        <View style={styles.emptyCommentBox}>
          <Text style={styles.emptyText}>Henüz yorum yapılmamış.</Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <View key={review.id || index} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>
                {review.fullName || review.userName || "Kullanıcı"}
              </Text>
              <Text style={styles.commentDate}>
                {formatDate(review.createdAt)}
              </Text>
            </View>

            <Text style={styles.commentRating}>⭐ {review.rating ?? 0}</Text>

            <Text style={styles.commentText}>
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
    backgroundColor: "#f6f6f6",
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
    backgroundColor: "#d9e4d8",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  imageText: {
    color: "#4d5c4c",
    fontWeight: "600",
    fontSize: 16,
  },

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 13,
    elevation: 3,
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },

  infoRow: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    color: "#222",
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
    color: "#222",
    marginBottom: 12,
  },

  commentCard: {
    backgroundColor: "#ffffff",
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
    color: "#222",
  },

  commentDate: {
    fontSize: 12,
    color: "#777",
  },

  commentRating: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },

  commentText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  emptyCommentBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
  },
});