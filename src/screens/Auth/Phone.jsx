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

polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);

class CustomStorage {
  set(key, value) {
    return AsyncStorage.setItem(key, value);
  }

  get(key) {
    return AsyncStorage.getItem(key);
  }
}

export default function AuthPhoneScreen({ navigation }) {
  useEffect(() => {
    const api_id = process.env.API_ID;
    const api_hash = process.env.API_HASH;

    // const mtproto = new MTProto({
    //   api_id,
    //   api_hash,
    //   storageOptions: {
    //     instance: new CustomStorage(),
    //   },
    // });

    // console.log("Hello from useEffect");
    // const start = Date.now();

    // mtproto.call("help.getNearestDc").then((result) => {
    //   console.log("country:", result.country, Date.now() - start, "ms");
    //   setCountry(result.country);
    // });
  }, []);

  const phoneSubmit = () => {
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
          onPress={phoneSubmit}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoider>
    </View>
  );
}
