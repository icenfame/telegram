import mtproto from "../../mtproto";
import colors from "../../styles/colors";
import getAvatarColor from "../../utils/getAvatarColor";
import getAvatarTitle from "../../utils/getAvatarTitle";
import getChatPhoto from "../../utils/getChatPhoto";
import getMediaType from "../../utils/getMediaType";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
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
      const dialogs = await mtproto.call("messages.getDialogs", {
        offset_peer: {
          _: "inputPeerEmpty",
        },
        exclude_pinned: true,
        limit: 1,
      });

      console.log(Object.keys(dialogs), dialogs.dialogs.length);
      console.log(dialogs);

      const allChats = [];

      for (const dialog of dialogs.dialogs) {
        if (dialog.peer._ === "peerUser") {
          const user = dialogs.users.find(
            (elem) => elem.id === dialog.peer.user_id
          );
          const message = dialogs.messages.find(
            (elem) => elem.peer_id.user_id === dialog.peer.user_id
          );
          const date = moment.unix(message.date);
          const photo = await getChatPhoto("inputPeerUser", user);

          allChats.push({
            id: user.id,
            title: user.self
              ? "Saved messages"
              : user.first_name + (user.last_name ? " " + user.last_name : ""),
            message: message.message,
            media: getMediaType(message),
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: user.verified,
            self: user.self,
            photo: photo,
            avatarTitle: getAvatarTitle(user.first_name, user.last_name),
            avatarColor: getAvatarColor(user.id),
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        if (dialog.peer._ === "peerChat") {
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
          const photo = await getChatPhoto("inputPeerChat", chat);

          allChats.push({
            id: chat.id,
            title: chat.title,
            message: message.message,
            messageFrom: user.first_name,
            media: getMediaType(message),
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: chat.verified,
            photo: photo,
            avatarTitle: getAvatarTitle(chat.title),
            avatarColor: getAvatarColor(chat.id),
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }

        if (dialog.peer._ === "peerChannel") {
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
          const photo = await getChatPhoto("inputPeerChannel", chat);

          allChats.push({
            id: chat.id,
            title: chat.title,
            message: message.message,
            messageFrom: user?.first_name,
            media: getMediaType(message),
            unreadCount: dialog.unread_count,
            out: !chat.broadcast && message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: chat.verified,
            photo: photo,
            avatarTitle: getAvatarTitle(chat.title),
            avatarColor: getAvatarColor(chat.id),
            date: moment.unix(moment().unix()).isSame(date, "date")
              ? date.format("HH:mm")
              : date.format("DD.MM.YYYY"),
          });
        }
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
          <View
            style={[
              styles.chat,
              item.pinned ? { backgroundColor: "#f5f5f5" } : null,
            ]}
          >
            <ImageBackground
              source={!item.self && item.photo ? { uri: item.photo } : null}
              style={[
                styles.chatPhoto,
                !item.photo || item.self
                  ? {
                      backgroundColor: item.self
                        ? colors.primary
                        : item.avatarColor,
                    }
                  : null,
              ]}
              imageStyle={{ borderRadius: 64 }}
            >
              {item.self ? (
                <MaterialCommunityIcons
                  style={styles.chatSavedMessages}
                  name="bookmark"
                />
              ) : !item.photo ? (
                <Text style={styles.chatPhotoText}>{item.avatarTitle}</Text>
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
                  {item.media ? item.media : item.message}
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
