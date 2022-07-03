import KeyboardAvoider from "../../components/KeyboardAvoider";
import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";

export default function AuthPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState(null);
  const [country, setCountry] = useState(null);
  const input = useRef(null);

  const countries = {
    UA: "+380",
  };

  useEffect(() => {
    // (async () => {
    //   await AsyncStorage.clear();

    //   const res = await AsyncStorage.getAllKeys();

    //   console.log(res);
    // })();

    const start = Date.now();
    mtproto.call("help.getNearestDc").then((result) => {
      console.log(result.country, Date.now() - start, "ms");
      setCountry(result.country);
      input.current.focus();
    });

    (async () => {
      try {
        const me = await mtproto.call("users.getFullUser", {
          id: {
            _: "inputUserSelf",
          },
        });

        if (me) {
          navigation.replace("SettingsProfile");

          return;
        }
      } catch (error) {}
    })();
  }, []);

  const phoneSubmit = async () => {
    const { phone_code_hash } = await mtproto.call("auth.sendCode", {
      phone_number: phone,
      settings: {
        _: "codeSettings",
      },
    });

    console.log(phone, phone_code_hash);

    navigation.push("AuthCode", { phone_number: phone, phone_code_hash });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoider style={styles.container}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />

        <Text style={styles.logoTitle}>Telegram</Text>
        <Text style={styles.logoCaption}>Enter phone number to continue</Text>

        <TextInput
          placeholder="Phone"
          selectionColor={colors.primary}
          style={styles.input}
          keyboardType="phone-pad"
          defaultValue={countries[country]}
          maxLength={13}
          ref={input}
          onChangeText={setPhone}
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
