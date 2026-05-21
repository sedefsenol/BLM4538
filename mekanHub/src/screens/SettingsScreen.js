import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen({ navigation }) {
  const API_URL = "http://10.0.2.2:5000";

  const { isDark, toggleTheme } = useTheme();
  const { user, logout: authLogout } = useAuth();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${user.id}`);
      setFullName(res.data.FullName || res.data.fullName || "");
    } catch (error) {
      console.log("GET USER ERROR:", error.response?.data || error.message);
    }
  };

  const updateProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Uyarı", "İsim boş olamaz.");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/users/${user.id}`, {
        fullName: fullName.trim(),
      });

      Alert.alert("Başarılı", "Profil bilgileri güncellendi.");
    } catch (error) {
      Alert.alert("Hata", "Profil güncellenemedi.");
    }
  };

  const logout = () => {
  authLogout();

  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111" : "#f6f6f6" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#222" }]}>
        Ayarlar
      </Text>

      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
          Profil Bilgileri
        </Text>

        <Text style={[styles.label, { color: isDark ? "#bbb" : "#777" }]}>
          Kullanıcı Adı
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#111" : "#f9f9f9",
              color: isDark ? "#fff" : "#222",
              borderColor: isDark ? "#333" : "#ddd",
            },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="İsim gir"
          placeholderTextColor={isDark ? "#777" : "#999"}
        />

        <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
          Tema
        </Text>

        <TouchableOpacity
          style={[
            styles.themeButton,
            !isDark && styles.activeThemeButton,
          ]}
          onPress={() => toggleTheme(false)}
        >
          <Text style={styles.themeText}>Açık Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeButton,
            isDark && styles.activeThemeButton,
          ]}
          onPress={() => toggleTheme(true)}
        >
          <Text style={styles.themeText}>Koyu Tema</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#222" }]}>
          Çıkış Yap
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#698a6b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  themeButton: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },

  activeThemeButton: {
    borderColor: "#698a6b",
    backgroundColor: "#e4efe3",
  },

  themeText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#698a6b",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});