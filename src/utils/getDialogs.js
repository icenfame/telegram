import mtproto from "../mtproto";
import { convertDate } from "../utils/convertDate";
import { getAvatarColor } from "../utils/getAvatarColor";
import { getAvatarTitle } from "../utils/getAvatarTitle";
import { getChatPhoto } from "../utils/getChatPhoto";
import { getMediaType } from "../utils/getMediaType";

export async function getDialogs(
  limit,
  includePinned = false,
  offset_date = 0
) {
  const dialogs = await mtproto.call("messages.getDialogs", {
    offset_peer: {
      _: "inputPeerEmpty",
    },
    exclude_pinned: true,
    limit,
    offset_date,
  });

  if (includePinned) {
    const pinned = await mtproto.call("messages.getPinnedDialogs", {
      folder_id: 0,
    });

    dialogs.dialogs = [...pinned.dialogs, ...dialogs.dialogs];
    dialogs.chats = [...pinned.chats, ...dialogs.chats];
    dialogs.messages = [...pinned.messages, ...dialogs.messages];
    dialogs.users = [...pinned.users, ...dialogs.users];
  }

  const peers = {
    peerUser: "user_id",
    peerChat: "chat_id",
    peerChannel: "channel_id",
  };

  const inputPeers = {
    peerUser: "inputPeerUser",
    peerChat: "inputPeerChat",
    peerChannel: "inputPeerChannel",
  };

  const messageActions = {
    messageActionChatEditTitle: "Changed group name", // updateNewChannelMessage - updates
    messageActionChatEditPhoto: "Updated group photo",
    messageActionChatDeletePhoto: "Removed group photo",
    messageActionContactSignUp: "Joined Telegram", // updateNewMessage - updates
    messageActionPhoneCall: "Phone call",
  };

  const chats = [];

  for (const dialog of dialogs.dialogs) {
    const peer = peers[dialog.peer._];
    const dialogPeer = dialog.peer[peer];
    const inputPeer = inputPeers[dialog.peer._];
    const userPeer = peer === "user_id";

    const chat = dialogs.chats.find((chat) => chat.id === dialogPeer);
    const message = dialogs.messages.find(
      (message) => message.peer_id[peer] === dialogPeer
    );
    const user = dialogs.users.find(
      (user) => user.id === (userPeer ? dialogPeer : message.from_id?.user_id)
    );

    if (
      message._ === "messageService" &&
      message.action._ === "messageActionChatMigrateTo"
    ) {
      continue;
    }

    chats.push({
      // With conditions
      id: userPeer ? user.id : chat.id,
      accessHash: userPeer ? user.access_hash : chat.access_hash,
      title: userPeer
        ? user.self
          ? "Saved messages"
          : `${user.first_name} ${user.last_name ?? ""}`
        : chat.title,
      verified: userPeer ? user.verified : chat.verified,
      photo: await getChatPhoto(inputPeer, userPeer ? user : chat),
      avatarTitle: getAvatarTitle(userPeer ? user.first_name : chat.title),
      avatarColor: getAvatarColor(userPeer ? user.id : chat.id),
      // Shared
      message: message.message,
      messageId: message.id,
      messageFrom: chat && user?.first_name,
      messageService: messageActions[message.action?._],
      media: getMediaType(message),
      self: !chat && user?.self,
      out: !chat?.broadcast && message.out,
      unreadCount: dialog.unread_count,
      read: dialog.read_outbox_max_id === dialog.top_message,
      pinned: dialog.pinned,
      date: convertDate(message.date),
      dateSeconds: message.date,
      online:
        !chat &&
        !user.self &&
        !user.bot &&
        user.status._ === "userStatusOnline",
      typing: false,
    });
  }

  return chats;
}
