import mtproto from "../mtproto";
import { Buffer } from "buffer";

export async function getChatPhoto(inputPeer, peer) {
  if (peer.photo._ !== "userProfilePhoto" && peer.photo._ !== "chatPhoto") {
    return null;
  }

  const photo = await mtproto.call(
    "upload.getFile",
    {
      location: {
        _: "inputPeerPhotoFileLocation",
        peer: {
          _: inputPeer,
          [`${inputPeer.slice(9).toLowerCase()}_id`]: peer.id,
          access_hash: peer.access_hash,
        },
        photo_id: peer.photo.photo_id,
      },
      offset: 0,
      limit: 32768,
    },
    {
      dcId: peer.photo.dc_id,
    }
  );

  return (
    "data:image/jpeg;base64," + Buffer.from(photo.bytes).toString("base64")
  );
}
