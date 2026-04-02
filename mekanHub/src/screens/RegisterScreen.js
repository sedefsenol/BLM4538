import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  try {
    await axios.post(
      "http://10.0.2.2:5000/api/auth/register",
      {
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }
    );

    navigation.navigate("Login");
  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data || error.message);
  }
};

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>MekanHub</Text>
      <Text style={styles.subtitle}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#777"
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#777"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#777"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#3f5440",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: "#222",
  },
  button: {
    backgroundColor: "#698a6b",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  buttonText: {
    color: "#222",
    fontSize: 17,
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
    color: "#3f5440",
    fontWeight: "600",
  },
});