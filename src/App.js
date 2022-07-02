import AuthCodeScreen from "./screens/Auth/Code";
import AuthPasswordScreen from "./screens/Auth/Password";
import AuthPhoneScreen from "./screens/Auth/Phone";
import SettingsProfileScreen from "./screens/Settings/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as expo from "expo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import WebviewCrypto from "react-native-webview-crypto";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    console.log("useEffect in App.js");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <WebviewCrypto />

      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthPhone">
          <Stack.Screen
            name="AuthPhone"
            component={AuthPhoneScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="AuthCode"
            component={AuthCodeScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="AuthPassword"
            component={AuthPasswordScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />

          <Stack.Screen
            name="SettingsProfile"
            component={SettingsProfileScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
              headerBackTitle: "Back",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

expo.registerRootComponent(App);
