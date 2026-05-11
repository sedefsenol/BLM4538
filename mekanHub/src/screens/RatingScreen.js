import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import axios from "axios";

export default function RatingScreen({ route, navigation }) {
  const { id } = route.params;

  const [quietness, setQuietness] = useState("");
  const [wifi, setWifi] = useState("");
  const [socket, setSocket] = useState("");
  const [comfort, setComfort] = useState("");
  const [crowdedness, setCrowdedness] = useState("");

  const submitReview = async () => {
    try {
      await axios.post(
        "http://10.0.2.2:5000/api/reviews",
        {
          placeId: id,
          userId: 1,
          quietnessScore: Number(quietness),
          wifiScore: Number(wifi),
          socketScore: Number(socket),
          comfortScore: Number(comfort),
          crowdednessScore: Number(crowdedness),
        }
      );

      Alert.alert("Başarılı", "Puan kaydedildi");
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Hata", "Puan kaydedilemedi");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mekan Puanlama</Text>

      <TextInput
        placeholder="Sessizlik"
        style={styles.input}
        keyboardType="numeric"
        value={quietness}
        onChangeText={setQuietness}
      />

      <TextInput
        placeholder="Wifi"
        style={styles.input}
        keyboardType="numeric"
        value={wifi}
        onChangeText={setWifi}
      />

      <TextInput
        placeholder="Priz"
        style={styles.input}
        keyboardType="numeric"
        value={socket}
        onChangeText={setSocket}
      />

      <TextInput
        placeholder="Rahatlık"
        style={styles.input}
        keyboardType="numeric"
        value={comfort}
        onChangeText={setComfort}
      />

      <TextInput
        placeholder="Kalabalık"
        style={styles.input}
        keyboardType="numeric"
        value={crowdedness}
        onChangeText={setCrowdedness}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={submitReview}
      >
        <Text style={styles.buttonText}>
          Kaydet
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});