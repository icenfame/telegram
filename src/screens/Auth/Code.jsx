import KeyboardAvoider from "../../components/KeyboardAvoider";
import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import styles from "./styles";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";

export default function AuthCode({ navigation, route }) {
  const [code, setCode] = useState(null);
  const input = useRef(null);

  useEffect(() => {
    setTimeout(() => input.current.focus(), 500);
  }, []);

  const codeSubmit = async () => {
    try {
      const res = await mtproto.call("auth.signIn", {
        phone_code: code,
        phone_number: route.params.phone_number,
        phone_code_hash: route.params.phone_code_hash,
      });

      navigation.push("SettingsProfile");

      console.log(res);
    } catch (error) {
      if (error.error_message === "SESSION_PASSWORD_NEEDED") {
        navigation.push("AuthPassword");
      }

      console.log(error.error_message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoider style={styles.container}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />

        <Text style={styles.logoTitle}>Telegram</Text>
        <Text style={styles.logoCaption}>Enter auth code to continue</Text>

        <TextInput
          placeholder="Code"
          selectionColor={colors.primary}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={5}
          ref={input}
          onChangeText={setCode}
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
