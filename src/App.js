import AuthCode from "./screens/Auth/Code";
import AuthPassword from "./screens/Auth/Password";
import AuthPhone from "./screens/Auth/Phone";
import ChatsDialogs from "./screens/Chats/Dialogs";
import SettingsProfile from "./screens/Settings/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as expo from "expo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import WebviewCrypto from "react-native-webview-crypto";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    console.log("useEffect in App.js");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <WebviewCrypto />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthPhone">
          <Stack.Screen
            name="AuthPhone"
            component={AuthPhone}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="AuthCode"
            component={AuthCode}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="AuthPassword"
            component={AuthPassword}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />

          <Stack.Screen
            name="SettingsProfile"
            component={SettingsProfile}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />

          <Stack.Screen
            name="ChatsDialogs"
            component={ChatsDialogs}
            options={{
              headerTitle: "Chats",
              headerBackTitle: "My profile",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

expo.registerRootComponent(App);
