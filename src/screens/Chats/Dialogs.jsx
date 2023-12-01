import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import mtproto from "../../mtproto";
import { convertDate } from "../../utils/convertDate";
import { getAvatarColor } from "../../utils/getAvatarColor";
import { getAvatarTitle } from "../../utils/getAvatarTitle";
import { getChatPhoto } from "../../utils/getChatPhoto";
import { getDialogs } from "../../utils/getDialogs";
import { getMediaType } from "../../utils/getMediaType";

import colors from "../../styles/colors";
import styles from "./styles";

export default function ChatsDialogs() {
  const chatsRef = useRef([]);
  const [chats, setChats] = useState([]);
  const loading = useRef(false);
  const [scrollEnd, setScrollEnd] = useState(false);

  useEffect(() => {
    const updatesTooLongHandler = (updateInfo) => {
      console.log("updatesTooLong:", updateInfo);
    };
    const updatesCombinedHandler = (updateInfo) => {
      console.log("updatesCombined:", updateInfo);
    };

    const updateShortMessageHandler = async (updateInfo) => {
      // Private new message
      const index = chatsRef.current.findIndex(
        (chat) => chat.id === updateInfo.user_id
      );

      if (index !== -1) {
        chatsRef.current = [
          {
            ...chatsRef.current[index],
            message: updateInfo.message,
            messageId: updateInfo.id,
            unreadCount: updateInfo.out
              ? 0
              : ++chatsRef.current[index].unreadCount,
            out: updateInfo.out,
            typing: false,
            read: false,
            date: convertDate(updateInfo.date),
          },
          ...chatsRef.current.filter((chat) => chat.id !== updateInfo.user_id),
        ];
        setChats(chatsRef.current);
      } else {
        const chat = await mtproto.call("messages.getPeerDialogs", {
          peers: [
            {
              _: "inputDialogPeer",
              peer: {
                _: "inputPeerUser",
                user_id: updateInfo.user_id,
              },
            },
          ],
        });

        const dialog = chat.dialogs[0];
        const user = chat.users[0];
        const message = chat.messages[0];

        const userTitle = user.first_name + (user.last_name ? " " + user.last_name : "");

        chatsRef.current = [
          {
            id: user.id,
            accessHash: user.access_hash,
            title: user.self ? "Saved messages" : userTitle,
            message: message.message,
            messageId: message.id,
            media: getMediaType(message),
            unreadCount: dialog.unread_count,
            out: message.out,
            read: dialog.read_outbox_max_id === dialog.top_message,
            pinned: dialog.pinned,
            verified: user.verified,
            self: user.self,
            photo: await getChatPhoto("inputPeerUser", user),
            avatarTitle: getAvatarTitle(user.first_name, user.last_name),
            avatarColor: getAvatarColor(user.id),
            online: user.status._ === "userStatusOnline",
            typing: false,
            date: convertDate(message.date),
            dateSeconds: message.date,
          },
          ...chatsRef.current.filter((chat) => chat.id !== updateInfo.user_id),
        ];
        setChats(chatsRef.current);

        console.log(dialog);
      }

      console.log("updateShortMessage:", updateInfo);
    };
    const updateShortChatMessageHandler = (updateInfo) => {
      console.log("updateShortChatMessage:", updateInfo);
    };
    const updateShortSentMessageHandler = (updateInfo) => {
      console.log("updateShortSentMessage:", updateInfo);
    };

    const updateShortHandler = async (updateInfo) => {
      if (updateInfo.update._ === "updateUserStatus") {
        if (
          chatsRef.current.find((chat) => chat.id === updateInfo.update.user_id)
        ) {
          chatsRef.current = chatsRef.current.map((chat) =>
            chat.id === updateInfo.update.user_id
              ? {
                  ...chat,
                  online: updateInfo.update?.status._ === "userStatusOnline",
                }
              : chat
          );
          setChats(chatsRef.current);
        }

        return;
      }

      if (
        updateInfo.update._ === "updateUserTyping" &&
        updateInfo.update.user_id
      ) {
        chatsRef.current = chatsRef.current.map((chat) =>
          chat.id === updateInfo.update.user_id
            ? {
                ...chat,
                typing: true,
              }
            : chat
        );
        setChats(chatsRef.current);

        setTimeout(() => {
          chatsRef.current = chatsRef.current.map((chat) =>
            chat.id === updateInfo.update.user_id
              ? {
                  ...chat,
                  typing: false,
                }
              : chat
          );
          setChats(chatsRef.current);
        }, 5000);
      }

      if (
        updateInfo.update._ === "userProfilePhoto" &&
        updateInfo.update.user_id
      ) {
        chatsRef.current = await Promise.all(
          chatsRef.current.map(async (chat) =>
            chat.id === updateInfo.update.user_id
              ? {
                  ...chat,
                  photo: await getChatPhoto("inputPeerChat", {
                    photo: {
                      _: "userProfilePhoto",
                    },
                    user_id: chat.id,
                    access_hash: chat.access_hash,
                    photo_id: updateInfo.update.photo.photo_id,
                  }),
                }
              : chat
          )
        );
        setChats(chatsRef.current);
      }

      console.log("updateShort:", updateInfo);
    };
    const updatesHandler = async (updateInfo) => {
      if (
        updateInfo.updates[0]._ === "updateReadHistoryInbox" &&
        updateInfo.updates[0].peer._ === "peerUser"
      ) {
        chatsRef.current = chatsRef.current.map((chat) =>
          chat.id === updateInfo.updates[0]?.peer?.user_id
            ? {
                ...chat,
                unreadCount: updateInfo.updates[0].still_unread_count,
              }
            : chat
        );
        setChats(chatsRef.current);
      }

      if (
        updateInfo.updates[0]._ === "updateReadHistoryOutbox" &&
        updateInfo.updates[0].peer._ === "peerUser"
      ) {
        chatsRef.current = chatsRef.current.map((chat) =>
          chat.id === updateInfo.updates[0]?.peer?.user_id
            ? {
                ...chat,
                read: true,
              }
            : chat
        );
        setChats(chatsRef.current);
      }

      if (
        updateInfo.updates[0]._ === "updateEditMessage" &&
        updateInfo.updates[0]?.message?.peer_id._ === "peerUser"
      ) {
        chatsRef.current = chatsRef.current.map((chat) =>
          chat.id === updateInfo.updates[0]?.message?.peer_id?.user_id
            ? {
                ...chat,
                message: updateInfo.updates[0]?.message.message,
              }
            : chat
        );
        setChats(chatsRef.current);
      }

      if (updateInfo.updates[0]._ === "updateDeleteMessages") {
        const peer = chatsRef.current.find(
          (chat) => chat.messageId === updateInfo.updates[0]?.messages[0]
        );
        const dialog = await mtproto.call("messages.getPeerDialogs", {
          peers: [
            {
              _: "inputDialogPeer",
              peer: {
                _: "inputPeerUser",
                user_id: peer.id,
                access_hash: peer.accessHash,
              },
            },
          ],
        });

        console.log(dialog);

        if (
          chatsRef.current.find(
            (chat) => chat.dateSeconds < dialog.messages[0].date
          )
        ) {
          chatsRef.current = chatsRef.current.map((chat) =>
            updateInfo.updates[0]?.messages.find(
              (message) => chat.messageId === message
            )
              ? {
                  ...chat,
                  message: dialog.messages[0].message,
                  unreadCount: dialog.dialogs[0].unread_count,
                  out: dialog.out,
                  read: dialog.read_outbox_max_id === dialog.top_message,
                  date: convertDate(dialog.messages[0].date),
                  dateSeconds: dialog.messages[0].date,
                }
              : chat
          );
          chatsRef.current.sort((a, b) => b.dateSeconds > a.dateSeconds);
        } else {
          chatsRef.current = chatsRef.current.filter(
            (chat) => chat.id !== dialog.users[0].id
          );
        }

        setChats(chatsRef.current);
      }

      console.log("updates:", updateInfo, updateInfo.updates.length);
    };

    (async () => {
      await mtproto.call("account.updateStatus", {
        offline: false,
      });

      loading.current = true;
      setScrollEnd(false);

      const dialogs = await getDialogs(15, true);
      chatsRef.current = dialogs;

      setScrollEnd(dialogs.length < 15);
      setChats(chatsRef.current);

      loading.current = false;
    })();

    const updatesTooLong = mtproto.updates.on(
      "updatesTooLong",
      updatesTooLongHandler
    );
    const updatesCombined = mtproto.updates.on(
      "updatesCombined",
      updatesCombinedHandler
    );

    const updateShortMessage = mtproto.updates.on(
      "updateShortMessage",
      updateShortMessageHandler
    );
    const updateShortChatMessage = mtproto.updates.on(
      "updateShortChatMessage",
      updateShortChatMessageHandler
    );
    const updateShortSentMessage = mtproto.updates.on(
      "updateShortSentMessage",
      updateShortSentMessageHandler
    );

    const updateShort = mtproto.updates.on("updateShort", updateShortHandler);
    const updates = mtproto.updates.on("updates", updatesHandler);

    return () => {
      updatesTooLong.off("updatesTooLong", updatesTooLongHandler);
      updatesCombined.off("updatesCombined", updatesCombinedHandler);

      updateShortMessage.off("updateShortMessage", updateShortMessageHandler);
      updateShortChatMessage.off(
        "updateShortChatMessage",
        updateShortChatMessageHandler
      );
      updateShortSentMessage.off(
        "updateShortSentMessage",
        updateShortSentMessageHandler
      );

      updateShort.off("updateShort", updateShortHandler);
      updates.off("updates", updatesHandler);
    };
  }, []);

  const loadMoreDialogs = async (event) => {
    if (scrollEnd || loading.current) {
      return;
    }

    loading.current = true;
    console.log(event);

    const dialogs = await getDialogs(
      15,
      false,
      chatsRef.current.slice(-1)[0].dateSeconds
    );
    chatsRef.current = [...chatsRef.current, ...dialogs];

    setScrollEnd(!dialogs.length);
    setChats(chatsRef.current);

    loading.current = false;
  };

  return (
    <View style={styles.container}>
      <FlatList
        onEndReached={loadMoreDialogs}
        onEndReachedThreshold={0.4}
        ListFooterComponent={() =>
          !scrollEnd ? <ActivityIndicator style={styles.chatLoading} /> : null
        }
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.chat,
              item.pinned ? { backgroundColor: colors.gray6 } : null,
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

              {item.online ? <View style={styles.chatOnline}></View> : null}
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

                  {item.muted ? (
                    <MaterialCommunityIcons
                      style={styles.chatMuted}
                      name="volume-off"
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
                  {!item.typing && item.out
                    ? "You: "
                    : item.messageFrom
                    ? item.messageFrom + ": "
                    : ""}
                  {item.typing
                    ? "Typing..."
                    : item.messageService
                    ? item.messageService
                    : item.media && item.message
                    ? item.media + ", " + item.message
                    : item.media
                    ? item.media
                    : item.message}
                </Text>

                {item.unreadCount && !item.out ? (
                  <View
                    style={[
                      styles.chatUnreadCount,
                      item.muted ? { backgroundColor: colors.gray } : null,
                    ]}
                  >
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
