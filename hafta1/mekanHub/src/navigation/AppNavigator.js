import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Image } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MekanListScreen from "../screens/MekanListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#698a6b",
        },
        headerTitleAlign: "left",
        headerTitleStyle: {
          color: "#222",
          fontSize: 24,
          fontWeight: "700",
        },
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
      <Tab.Screen
        name="AnaSayfa"
        component={HomeScreen}
        options={{
          title: "MekanHub",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
          },
        }}
      />

      <Tab.Screen
        name="Arama"
        component={MekanListScreen}
        options={{
          title: "MekanHub",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
          },
        }}
      />

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: "MekanHub",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
          },
        }}
      />
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