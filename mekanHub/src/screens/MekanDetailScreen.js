import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import axios from "axios";

export default function MekanDetailScreen({ route, navigation }) {
  const [mekan, setMekan] = useState(null);


  useEffect(() => {
    const id = route.params.id;

    axios
      .get(`http://10.0.2.2:5000/api/places/${id}`)
      .then((res) => setMekan(res.data))
      .catch((err) => console.log("DETAIL ERROR:", err));
  }, []);


  if (!mekan) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Mekan Görseli</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{mekan.name}</Text>

      
        <Text style={styles.desc}>
          {mekan.description || "Açıklama bulunmuyor."}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Konum</Text>
          <Text style={styles.value}>
            {mekan.location || "Belirtilmedi"}
          </Text>
        </View>

      
        <View style={styles.infoBox}>
          <Text style={styles.label}>Puan</Text>
          <Text style={styles.value}>
            ⭐ {mekan.averageRating ?? 0}
          </Text>
        </View>

      
        <View style={styles.infoBox}>
          <Text style={styles.label}>Yorum Sayısı</Text>
          <Text style={styles.value}>
            {mekan.reviewCount ?? 0}
          </Text>
        </View>
        <TouchableOpacity
  style={styles.rateButton}
  onPress={() =>
    navigation.navigate("RatingScreen", {
      id: mekan.id
    })
  }
>
  <Text style={styles.rateButtonText}>
    Puan Ver
  </Text>
</TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 16,
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: "#d9e4d8",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imageText: {
    color: "#4d5c4c",
    fontWeight: "600",
    fontSize: 16,
  },
  contentBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#666",
    marginBottom: 18,
    lineHeight: 22,
  },
  infoBox: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
  },

  rateButton: {
  backgroundColor: "#4CAF50",
  padding: 14,
  borderRadius: 12,
  marginTop: 20,
  alignItems: "center",
},

rateButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
});