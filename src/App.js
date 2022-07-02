import AuthCodeScreen from "./screens/Auth/Code";
import AuthPhoneScreen from "./screens/Auth/Phone";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as expo from "expo";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import WebviewCrypto from "react-native-webview-crypto";

export default function App() {
  const Stack = createNativeStackNavigator();

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
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

expo.registerRootComponent(App);
