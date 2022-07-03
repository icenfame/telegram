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
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
} from "react-native";

export default function ChatsDialogsScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // mtproto.updates.on("updates", (updateInfo) => {
    //   console.log("updates:", updateInfo);
    // });

    (async () => {
      const colors = [
        "#ff516a", // red
        "#54cb68", // green
        "#2a9ef1", // blue
        "#665fff", // violet
        "#d669ed", // pink
        "#28c9b7", // cyan
        "#ffa85c", // orange
      ];
      const colorsMap = [0, 6, 3, 1, 5, 2, 4];

      const dialogs = await mtproto.call("messages.getDialogs", {
        offset_peer: {
          _: "inputPeerEmpty",
        },
        exclude_pinned: true,
        limit: 5,
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

          let photo = null;

          if (user.photo && user.photo._ === "userProfilePhoto") {
            photo = await mtproto.call("upload.getFile", {
              location: {
                _: "inputPeerPhotoFileLocation",
                peer: {
                  _: "inputPeerUser",
                  user_id: user.id,
                  access_hash: user.access_hash,
                },
                photo_id: user.photo.photo_id,
              },
              offset: 0,
              limit: 32768,
            });

            photo =
              "data:image/jpeg;base64," +
              Buffer.from(photo.bytes).toString("base64");
          }

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
            photo: photo,
            photoTitle: user.first_name[0] + (user?.last_name?.[0] ?? ""),
            photoColor: colors[colorsMap[Math.abs(user.id) % 7]],
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

          let photo = null;
          if (chat.photo._ !== "chatPhotoEmpty") {
            photo = await mtproto.call("upload.getFile", {
              location: {
                _: "inputPeerPhotoFileLocation",
                peer: {
                  _: "inputPeerChat",
                  chat_id: chat.id,
                  access_hash: chat.access_hash,
                },
                photo_id: chat.photo.photo_id,
              },
              offset: 0,
              limit: 32768,
            });

            photo =
              "data:image/jpeg;base64," +
              Buffer.from(photo.bytes).toString("base64");
          }

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
            photo: photo,
            photoTitle: chat.title[0],
            photoColor: colors[colorsMap[Math.abs(chat.id) % 7]],
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

          let photo = null;
          if (chat.photo._ !== "chatPhotoEmpty") {
            photo = await mtproto.call("upload.getFile", {
              location: {
                _: "inputPeerPhotoFileLocation",
                peer: {
                  _: "inputPeerChannel",
                  channel_id: chat.id,
                  access_hash: chat.access_hash,
                },
                photo_id: chat.photo.photo_id,
              },
              offset: 0,
              limit: 32768,
            });

            photo =
              "data:image/jpeg;base64," +
              Buffer.from(photo.bytes).toString("base64");
          }

          allChats.push({
            id: chat.id,
            title: chat.title,
            message: message.message,
            messageFrom: user?.first_name,
            unreadCount: dialog.unread_count,
            out: !chat.broadcast && message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: chat.verified,
            photo: photo,
            photoTitle: chat.title[0],
            photoColor: colors[colorsMap[Math.abs(chat.id) % 7]],
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        // console.log(dialogs);
      }

      setChats(allChats);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chat}>
            <ImageBackground
              source={item.photo ? { uri: item.photo } : null}
              style={[
                styles.chatPhoto,
                !item.photo ? { backgroundColor: item.photoColor } : null,
              ]}
              imageStyle={{ borderRadius: 64 }}
            >
              {!item.photo ? (
                <Text style={styles.chatPhotoText}>{item.photoTitle}</Text>
              ) : null}
            </ImageBackground>

            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <View style={styles.chatTitle}>
                  <Text style={styles.chatTitleText} numberOfLines={1}>
                    {item.title}
                  </Text>

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
                <Text style={styles.chatMessage} numberOfLines={2}>
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
