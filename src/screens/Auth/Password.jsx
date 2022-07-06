import KeyboardAvoider from "../../components/KeyboardAvoider";
import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import styles from "./styles";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";

export default function AuthPassword({ navigation, route }) {
  const [password, setPassword] = useState(null);
  const input = useRef(null);

  useEffect(() => {
    setTimeout(() => input.current.focus(), 500);
  }, []);

  const passwordSubmit = async () => {
    let start = Date.now();

    const { srp_id, current_algo, srp_B } = await mtproto.call(
      "account.getPassword"
    );
    const { g, p, salt1, salt2 } = current_algo;

    console.log("account.getPassword", Date.now() - start, "ms");
    start = Date.now();

    const { A, M1 } = await mtproto.crypto.getSRPParams({
      g,
      p,
      salt1,
      salt2,
      gB: srp_B,
      password,
    });

    console.log("crypto.getSRPParams", Date.now() - start, "ms");
    start = Date.now();

    const checkPasswordResult = await mtproto.call("auth.checkPassword", {
      password: {
        _: "inputCheckPasswordSRP",
        srp_id,
        A,
        M1,
      },
    });

    console.log("crypto.getSRPParams", Date.now() - start, "ms");
    // console.log(checkPasswordResult);

    await navigation.popToTop();
    await navigation.replace("SettingsProfile");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoider style={styles.container}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />

        <Text style={styles.logoTitle}>Telegram</Text>
        <Text style={styles.logoCaption}>Enter password to continue</Text>

        <TextInput
          placeholder="Password"
          selectionColor={colors.primary}
          style={styles.input}
          secureTextEntry={true}
          ref={input}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={passwordSubmit}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoider>
    </View>
  );
}
