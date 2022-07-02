import KeyboardAvoider from "../../components/KeyboardAvoider";
import colors from "../../styles/colors";
import styles from "./styles";
import MTProto from "@mtproto/core/envs/browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import "react-native-get-random-values";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { TextEncoder, TextDecoder } from "web-encoding";

export default function AuthCodeScreen() {
  const codeSubmit = () => {
    navigation.push("AuthCode");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoider style={styles.container}>
        <Image
          source={{
            url: "https://seeklogo.com/images/T/telegram-logo-AD3D08A014-seeklogo.com.png",
          }}
          style={styles.logo}
        />

        <Text style={styles.logoTitle}>Telegram</Text>
        <Text style={styles.logoCaption}>Enter phone number to continue</Text>

        <TextInput
          placeholder="Phone"
          maxLength={20}
          selectionColor={colors.primary}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={codeSubmit}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoider>
    </View>
  );
}
