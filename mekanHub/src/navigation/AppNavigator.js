import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MekanListScreen from "../screens/MekanListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MekanDetailScreen from "../screens/MekanDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ source, focused }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={source}
        style={{
          width: 50,
          height: 50,
          resizeMode: "contain",
          opacity: focused ? 1 : 0.6,
        }}
      />
      {focused && (
        <View
          style={{
            marginTop: 6,
            width: 28,
            height: 3,
            borderRadius: 2,
            backgroundColor: "#222",
          }}
        />
      )}
    </View>
  );
}

function defaultStackOptions() {
  return {
    headerStyle: {
      backgroundColor: "#698a6b",
    },
    headerTitleAlign: "left",
    headerTitleStyle: {
      color: "#000",
      fontSize: 20,
      fontWeight: "bold",
    },
  };
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions()}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "MekanHub" }}
      />
      <Stack.Screen
        name="MekanDetail"
        component={MekanDetailScreen}
        options={{ title: "Mekan Detayı" }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions()}>
      <Stack.Screen
        name="SearchMain"
        component={MekanListScreen}
        options={{ title: "MekanHub" }}
      />
      <Stack.Screen
        name="MekanDetailSearch"
        component={MekanDetailScreen}
        options={{ title: "Mekan Detayı" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions()}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "MekanHub" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#698a6b",
          height: 72,
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "AnaSayfa") {
            return (
              <TabIcon
                source={require("../assets/icons/home.png")}
                focused={focused}
              />
            );
          }

          if (route.name === "Arama") {
            return (
              <TabIcon
                source={require("../assets/icons/search.png")}
                focused={focused}
              />
            );
          }

          return (
            <TabIcon
              source={require("../assets/icons/profile.png")}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="AnaSayfa" component={HomeStack} />
      <Tab.Screen name="Arama" component={SearchStack} />
      <Tab.Screen name="Profil" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}