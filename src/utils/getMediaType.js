export default function getMediaType(message) {
  // Photo compressed
  if (message.media?._ === "messageMediaPhoto") {
    return "📷 Photo";
  }

  if (message.media?._ === "messageMediaDocument") {
    const attr = message.media?.document.attributes;

    // Sticker
    if (attr?.[1]?._ === "documentAttributeSticker") {
      return attr?.[1]?.alt + " Sticker";
    }

    // Photo uncompressed
    if (attr?.[0]?._ === "documentAttributeImageSize") {
      return "📸 Image";
    }

    // GIF
    if (attr?.[2]?._ === "documentAttributeAnimated") {
      return "📺 GIF";
    }

    // Audio
    if (attr?.[0]?._ === "documentAttributeAudio") {
      if (attr?.[0].voice) {
        return "🎤 Voice message";
      }

      return "🔊 Audio file";
    }

    // Video
    if (attr?.[0]?._ === "documentAttributeVideo") {
      if (attr?.[0].round_message) {
        return "🤳 Video message";
      }

      return "🎥 Video";
    }

    // File
    if (attr?.[0]?._ === "documentAttributeFilename") {
      return "📁 File";
    }
  }

  return null;
}
