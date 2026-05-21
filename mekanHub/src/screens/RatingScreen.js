import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function RatingScreen({ route, navigation }) {
  const { id } = route.params;
  const { isDark } = useTheme();
    const { user } = useAuth();

  const API_URL = "http://10.0.2.2:5000";

  const [quietness, setQuietness] = useState(0);
  const [wifi, setWifi] = useState(0);
  const [socket, setSocket] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [crowdedness, setCrowdedness] = useState(0);
  const [comment, setComment] = useState("");

  const StarRating = ({ title, value, onChange }) => {
    return (
      <View style={styles.ratingBox}>
        <Text
          style={[
            styles.subTitle,
            { color: isDark ? "#fff" : "#222" },
          ]}
        >
          {title}
        </Text>

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TouchableOpacity key={item} onPress={() => onChange(item)}>
              <Text style={styles.star}>{item <= value ? "★" : "☆"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const submitReview = async () => {
    if (
      quietness === 0 ||
      wifi === 0 ||
      socket === 0 ||
      comfort === 0 ||
      crowdedness === 0
    ) {
      Alert.alert("Uyarı", "Lütfen tüm puan alanlarını yıldızla değerlendir.");
      return;
    }

    const calculatedRating =
      (quietness + wifi + socket + comfort + crowdedness) / 5;

    const payload = {
      placeId: id,
      userId: user.id,
      quietnessScore: quietness,
      wifiScore: wifi,
      socketScore: socket,
      comfortScore: comfort,
      crowdednessScore: crowdedness,
      overallScore: calculatedRating,
      rating: calculatedRating,
      comment: comment,
    };

    try {
      await axios.post(`${API_URL}/api/reviews`, payload);

      Alert.alert("Başarılı", "Değerlendirme kaydedildi");
      navigation.navigate("MekanDetail", { id });
    } catch (error) {
      console.log("REVIEW ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Kayıt başarısız",
        error.response?.data?.message || error.message || "Bilinmeyen hata"
      );
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111" : "#fff" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <StarRating title="Sessizlik" value={quietness} onChange={setQuietness} />
      <StarRating title="Wi-Fi" value={wifi} onChange={setWifi} />
      <StarRating title="Priz" value={socket} onChange={setSocket} />
      <StarRating title="Rahatlık" value={comfort} onChange={setComfort} />
      <StarRating
        title="Kalabalık"
        value={crowdedness}
        onChange={setCrowdedness}
      />

      <Text
        style={[
          styles.subTitle,
          { color: isDark ? "#fff" : "#222" },
        ]}
      >
        Yorum
      </Text>

      <TextInput
        placeholder="Yorum yaz..."
        style={[
          styles.commentInput,
          {
            backgroundColor: isDark ? "#1e1e1e" : "#fff",
            color: isDark ? "#fff" : "#222",
            borderColor: isDark ? "#333" : "#ccc",
          },
        ]}
        multiline
        numberOfLines={5}
        value={comment}
        onChangeText={setComment}
        placeholderTextColor={isDark ? "#888" : "#777"}
      />

      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  ratingBox: {
    marginBottom: 18,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontSize: 28,
    color: "#6ca15e",
    marginRight: 4,
  },

  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 18,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#698a6b",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});