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

export default function RatingScreen({ route, navigation }) {
  const { id } = route.params;

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
        <Text style={styles.subTitle}>{title}</Text>

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
      userId: 1,
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
      console.log("API_URL:", API_URL);
      console.log("REVIEW PAYLOAD:", payload);

      const response = await axios.post(`${API_URL}/api/reviews`, payload);

      console.log("REVIEW SUCCESS:", response.data);

      Alert.alert("Başarılı", "Değerlendirme kaydedildi");

      navigation.navigate("MekanDetail", { id });
    } catch (error) {
      console.log("===== REVIEW ERROR START =====");
      console.log("ERROR MESSAGE:", error.message);
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR DATA:", error.response?.data);
      console.log("ERROR URL:", error.config?.url);
      console.log("ERROR METHOD:", error.config?.method);
      console.log("ERROR PAYLOAD:", error.config?.data);
      console.log("===== REVIEW ERROR END =====");

      Alert.alert(
        "Kayıt başarısız",
        error.response?.data?.message || error.message || "Bilinmeyen hata"
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StarRating title="Sessizlik" value={quietness} onChange={setQuietness} />
      <StarRating title="Wi-Fi" value={wifi} onChange={setWifi} />
      <StarRating title="Priz" value={socket} onChange={setSocket} />
      <StarRating title="Rahatlık" value={comfort} onChange={setComfort} />
      <StarRating
        title="Kalabalık"
        value={crowdedness}
        onChange={setCrowdedness}
      />

      <Text style={styles.subTitle}>Yorum</Text>

      <TextInput
        placeholder="Yorum yaz..."
        style={styles.commentInput}
        multiline
        numberOfLines={5}
        value={comment}
        onChangeText={setComment}
        placeholderTextColor="#777"
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
    backgroundColor: "#fff",
    padding: 20,
  },

  ratingBox: {
    marginBottom: 18,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
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
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 18,
    color: "#222",
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