import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import Geolocation from "react-native-geolocation-service";

export default function MekanListScreen({ navigation }) {
  const { isDark } = useTheme();

  const API_URL = "http://10.0.2.2:5000";

  const [mekanlar, setMekanlar] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortType, setSortType] = useState("puan");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getMekanlar();
    getUserLocation();
  }, []);

  const getMekanlar = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/places/nearby-cafes`);

      const sadeceCafeler = res.data.filter((item) => {
        const text = `${item.name || ""} ${item.description || ""} ${
          item.location || ""
        }`.toLowerCase();

        const cafeMi =
          text.includes("cafe") ||
          text.includes("café") ||
          text.includes("kahve") ||
          text.includes("coffee") ||
          text.includes("starbucks");

        const istenmeyen =
          text.includes("hotel") ||
          text.includes("otel") ||
          text.includes("apart") ||
          text.includes("pansiyon") ||
          text.includes("suite");

        return cafeMi && !istenmeyen;
      });

      setMekanlar(sadeceCafeler);
    } catch (error) {
      console.log("MEKAN LIST ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Konum izni verilmedi");
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("LOCATION ERROR:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.log("GET LOCATION ERROR:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const puanGoster = (puan) => {
    const sayi = Number(puan);
    return sayi > 0 ? sayi.toFixed(1) : "Henüz puan yok";
  };

  const handleSearch = () => {
    setActiveSearch(searchText);
  };

  const clearSearch = () => {
    setSearchText("");
    setActiveSearch("");
  };

  const filteredMekanlar = useMemo(() => {
    const searchValue = activeSearch.trim().toLowerCase();

    let list = mekanlar.filter((item) => {
      const text = `${item.name || ""} ${item.location || ""} ${
        item.description || ""
      }`.toLowerCase();

      return text.includes(searchValue);
    });

    if (sortType === "puan") {
      list = [...list].sort(
        (a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0)
      );
    }

    if (sortType === "yakın" && userLocation) {
      list = [...list].sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );

        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );

        return distA - distB;
      });
    }

    return list;
  }, [activeSearch, mekanlar, sortType, userLocation]);

  const openCafeDetail = async (mekan) => {
    try {
      const res = await axios.post(`${API_URL}/api/places/google-save`, {
        name: mekan.name,
        location: mekan.location,
        description: mekan.description,
        averageRating: 0,
        latitude: mekan.latitude,
        longitude: mekan.longitude,
        googlePlaceId: mekan.googlePlaceId || mekan.id,
        imageUrl: mekan.imageUrl,
      });

      navigation.navigate("MekanDetailSearch", {
        id: res.data.id,
      });
    } catch (error) {
      console.log("OPEN CAFE ERROR:", error.response?.data || error.message);
    }
  };

  const renderItem = ({ item }) => {
    const distance =
      userLocation && item.latitude && item.longitude
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            item.latitude,
            item.longitude
          ).toFixed(1)
        : null;

    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
        ]}
        activeOpacity={0.8}
        onPress={() => openCafeDetail(item)}
      >
        <Text style={[styles.itemTitle, { color: isDark ? "#fff" : "#222" }]}>
          {item.name}
        </Text>

        <Text style={[styles.itemDesc, { color: isDark ? "#ccc" : "#666" }]}>
          {item.description || "Açıklama bulunmuyor"}
        </Text>

        <View style={styles.itemBottom}>
          <Text style={[styles.itemInfo, { color: isDark ? "#ccc" : "#444" }]}>
            {item.location || "Konum yok"}
          </Text>

          <Text style={[styles.itemInfo, { color: isDark ? "#ccc" : "#444" }]}>
            ⭐ {puanGoster(item.averageRating)}
          </Text>
        </View>

        {distance && (
          <Text style={[styles.distanceText, { color: isDark ? "#aaa" : "#777" }]}>
            Yaklaşık {distance} km uzaklıkta
          </Text>
        )}
      </TouchableOpacity>
    );
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
          Mekanlar yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111" : "#f6f6f6" },
      ]}
    >
      <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#222" }]}>
        Mekan Ara
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#1e1e1e" : "#fff",
              color: isDark ? "#fff" : "#222",
              borderColor: isDark ? "#333" : "#eee",
            },
          ]}
          placeholder="Kafe ara..."
          placeholderTextColor={isDark ? "#888" : "#777"}
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>

      {activeSearch ? (
        <TouchableOpacity onPress={clearSearch}>
          <Text style={[styles.clearText, { color: isDark ? "#ccc" : "#666" }]}>
            Aramayı temizle: {activeSearch}
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortType === "puan" && styles.activeFilter,
          ]}
          onPress={() => setSortType("puan")}
        >
          <Text style={styles.filterText}>Puana Göre</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            sortType === "yakın" && styles.activeFilter,
          ]}
          onPress={() => setSortType("yakın")}
        >
          <Text style={styles.filterText}>Yakınımdakiler</Text>
        </TouchableOpacity>
      </View>

      {sortType === "yakın" && !userLocation ? (
        <Text style={[styles.locationWarning, { color: isDark ? "#ccc" : "#666" }]}>
          Konum alınamadı. Yakınımdakiler için telefon konum izni gerekir.
        </Text>
      ) : null}

      <FlatList
        data={filteredMekanlar}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? "#ccc" : "#666" }]}>
            Aramaya uygun mekan bulunamadı.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
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

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    elevation: 2,
  },

  searchButton: {
    backgroundColor: "#698a6b",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  clearText: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: "right",
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  filterButton: {
    flex: 1,
    backgroundColor: "#dfe8dd",
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },

  activeFilter: {
    backgroundColor: "#698a6b",
  },

  filterText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 14,
  },

  locationWarning: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },

  itemCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  itemDesc: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },

  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  itemInfo: {
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },

  distanceText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});