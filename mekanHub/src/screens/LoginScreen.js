import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      await axios.post(
        "http://10.0.2.2:5000/api/auth/login",
        {
          fullName: fullName.trim(),
          password: password.trim(),
        }
      );

      navigation.replace("MainTabs");
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      setErrorMessage("Kullanıcı adı veya şifre hatalı");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpeg")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>MekanHub</Text>
      <Text style={styles.subtitle}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#777"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#777"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Kayıt Ol</Text>
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
    marginBottom: 8,
  },
  buttonText: {
    color: "#222",
    fontSize: 17,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
    color: "#698a6b",
    fontWeight: "600",
  },
});