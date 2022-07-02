import KeyboardAvoider from "../../components/KeyboardAvoider";
import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Buffer } from "buffer";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

export default function ChatsDialogsScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // mtproto.updates.on("updates", (updateInfo) => {
    //   console.log("updates:", updateInfo);
    // });

    (async () => {
      const dialogs = await mtproto.call("messages.getDialogs", {
        offset_peer: {
          _: "inputPeerEmpty",
        },
        // exclude_pinned: true,
        limit: 4,
      });

      console.log(Object.keys(dialogs), dialogs.dialogs.length);

      const allChats = [];

      for (const dialog of dialogs.dialogs) {
        if (dialog.peer._ == "peerUser") {
          const user = dialogs.users.find(
            (elem) => elem.id === dialog.peer.user_id
          );
          const message = dialogs.messages.find(
            (elem) => elem.peer_id.user_id === dialog.peer.user_id
          );
          const date = moment.unix(message.date);

          allChats.push({
            id: user.id,
            title: user.self
              ? "Saved messages"
              : user.first_name + (user.last_name ? " " + user.last_name : ""),
            message: message.message,
            messageFrom: "",
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: user.verified,
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        if (dialog.peer._ == "peerChat") {
          const chat = dialogs.chats.find(
            (elem) => elem.id === dialog.peer.chat_id
          );
          const message = dialogs.messages.find(
            (elem) => elem.peer_id.chat_id === dialog.peer.chat_id
          );
          const user = dialogs.users.find(
            (elem) => elem.id === message.from_id.user_id
          );
          const date = moment.unix(message.date);

          allChats.push({
            id: chat.id,
            title: chat.title,
            message: message.message,
            messageFrom: user.first_name,
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: chat.verified,
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        if (dialog.peer._ == "peerChannel") {
          const chat = dialogs.chats.find(
            (elem) => elem.id === dialog.peer.channel_id
          );
          const message = dialogs.messages.find(
            (elem) => elem.peer_id.channel_id === dialog.peer.channel_id
          );
          const user = dialogs.users.find(
            (elem) => elem.id === message?.from_id?.user_id
          );
          const date = moment.unix(message.date);

          allChats.push({
            id: chat.id,
            title: chat.title,
            message: message.message,
            messageFrom: user?.first_name,
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: chat.verified,
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        // console.log(dialogs);
      }

      setChats(allChats);
      // console.log(chats);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chat}>
            <Image
              style={styles.chatImage}
              source={{
                url: "https://www.onlinepalette.com/wp-content/uploads/2021/07/Telegram-Main-Logo.png",
              }}
            ></Image>

            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <View style={styles.chatTitle}>
                  <Text style={styles.chatTitleText}>{item.title}</Text>

                  {item.verified ? (
                    <MaterialCommunityIcons
                      style={styles.chatVerified}
                      name="check-decagram"
                    />
                  ) : null}
                </View>

                <View style={styles.chatDateRead}>
                  {item.out && item.read ? (
                    <MaterialCommunityIcons
                      style={styles.chatRead}
                      name="check-all"
                    />
                  ) : item.out ? (
                    <MaterialCommunityIcons
                      style={styles.chatRead}
                      name="check"
                    />
                  ) : null}

                  <Text style={styles.chatDate}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.chatFooter}>
                <Text style={styles.chatMessage}>
                  {item.out
                    ? "You: "
                    : item.messageFrom
                    ? item.messageFrom + ": "
                    : ""}
                  {item.message}
                </Text>

                {item.unreadCount && !item.out ? (
                  <View style={styles.chatUnreadCount}>
                    <Text style={styles.chatUnreadCountText}>
                      {item.unreadCount}
                    </Text>
                  </View>
                ) : item.pinned ? (
                  <MaterialCommunityIcons
                    style={styles.chatPinned}
                    name="pin"
                  />
                ) : null}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
