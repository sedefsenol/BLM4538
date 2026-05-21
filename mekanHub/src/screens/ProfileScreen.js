import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { isDark } = useTheme();
    const { user: currentUser } = useAuth();

  const API_URL = "http://10.0.2.2:5000";

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      const userRes = await axios.get(`${API_URL}/api/users/${currentUser.id}`);
      setUser(userRes.data);

      const reviewRes = await axios.get(`${API_URL}/api/reviews/user/${currentUser.id}`);
      setReviews(reviewRes.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = () => {
    return user?.FullName || user?.fullName || "Kullanıcı";
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return "0.0";

    const total = reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    return (total / reviews.length).toFixed(1);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR");
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDark ? "#111" : "#f6f6f6" },
        ]}
      >
        <ActivityIndicator size="large" color="#698a6b" />
        <Text style={[styles.loadingText, { color: isDark ? "#ccc" : "#555" }]}>
          Profil yükleniyor...
        </Text>
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
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileArea}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getUserName().charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.name, { color: isDark ? "#fff" : "#222" }]}>
          {getUserName()}
        </Text>
      </View>

      <View
        style={[
          styles.separator,
          { backgroundColor: isDark ? "#333" : "#d8d8d8" },
        ]}
      />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: isDark ? "#fff" : "#222" }]}>
            {reviews.length}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? "#bbb" : "#777" }]}>
            Yorum
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: isDark ? "#fff" : "#222" }]}>
            {getAverageRating()}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? "#bbb" : "#777" }]}>
            Ortalama Puan
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.separator,
          { backgroundColor: isDark ? "#333" : "#d8d8d8" },
        ]}
      />

      <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
        Yorumlarım
      </Text>

      {reviews.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          ]}
        >
          <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#777" }]}>
            Henüz yorum yapmadın.
          </Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <TouchableOpacity
  key={review.id || index}
  style={[
    styles.reviewCard,
    { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
  ]}
  activeOpacity={0.8}
  onPress={() =>
    navigation.navigate("MekanDetail", {
      id: review.placeId,
    })
  }
>
            <View style={styles.reviewTopRow}>
              <Text style={[styles.placeName, { color: isDark ? "#fff" : "#222" }]}>
                {review.placeName}
              </Text>

              <Text style={styles.ratingBadge}>
                ⭐ {Number(review.rating || 0).toFixed(1)}
              </Text>
            </View>

            <Text style={[styles.commentText, { color: isDark ? "#ccc" : "#444" }]}>
              {review.comment || "Yorum bulunmuyor."}
            </Text>

            <Text style={[styles.dateText, { color: isDark ? "#999" : "#888" }]}>
              {formatDate(review.createdAt)}
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
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  settingsIcon: {
    fontSize: 22,
  },

  profileArea: {
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#698a6b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "bold",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  separator: {
    height: 1,
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  emptyCard: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    elevation: 2,
    marginBottom: 30,
  },

  emptyText: {
    fontSize: 15,
  },

  reviewCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  reviewTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  placeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },

  ratingBadge: {
    backgroundColor: "#e4efe3",
    color: "#222",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 13,
  },

  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  dateText: {
    fontSize: 12,
    textAlign: "right",
  },
});