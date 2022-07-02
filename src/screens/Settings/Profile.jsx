import KeyboardAvoider from "../../components/KeyboardAvoider";
import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";

export default function SettingsProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // mtproto.updates.on("updates", (updateInfo) => {
    //   console.log("updates:", updateInfo);
    // });

    (async () => {
      const profile = await mtproto.call("users.getFullUser", {
        id: {
          _: "inputUserSelf",
        },
      });

      const profile_photo = await mtproto.call("upload.getFile", {
        location: {
          _: "inputPeerPhotoFileLocation",
          peer: {
            _: "inputPeerSelf",
          },
          photo_id: profile.full_user.profile_photo.id,
        },
        offset: 0,
        limit: 1024 * 1024,
      });

      profile.profile_photo =
        "data:image/jpeg;base64," +
        Buffer.from(profile_photo.bytes).toString("base64");

      setProfile(profile);
    })();
  }, []);

  const logOut = async () => {
    await mtproto.call("auth.logOut");

    // (async () => {
    //   await AsyncStorage.clear();

    //   const res = await AsyncStorage.getAllKeys();

    //   console.log(res);
    // })();

    await navigation.replace("AuthPhone");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: profile?.profile_photo,
        }}
        style={styles.logo}
      />

      <Text style={styles.logoTitle}>
        {profile?.users?.[0]?.first_name} {profile?.users?.[0]?.last_name}
      </Text>
      <Text style={styles.logoCaption}>+{profile?.users[0]?.phone}</Text>

      <Text style={styles.logoCaption}>{profile?.full_user.about}</Text>

      <TouchableOpacity onPress={logOut}>
        <Text
          style={{
            color: "red",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.push("ChatsDialogs")}
        style={{
          marginTop: 64,
        }}
      >
        <Text
          style={{
            fontSize: 20,
          }}
        >
          Chats
        </Text>
      </TouchableOpacity>
    </View>
  );
}
