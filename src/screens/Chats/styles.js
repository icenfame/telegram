import colors from "../../styles/colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray6,
  },

  chat: {
    alignSelf: "stretch",
    backgroundColor: colors.white,
    justifyContent: "space-between",
    flexDirection: "row",

    height: 80,
  },

  chatPhoto: {
    width: 64,
    height: 64,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    margin: 8,
    borderRadius: 64,
  },
  chatPhotoText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
  chatOnline: {
    width: 14,
    height: 14,
    backgroundColor: colors.green,
    borderRadius: 14,

    borderWidth: 2,
    borderColor: colors.white,

    position: "absolute",
    top: 48,
    left: 48,
  },

  chatInfo: {
    flex: 1,
    height: 80,

    borderBottomWidth: 1,
    borderBottomColor: colors.gray6,

    paddingRight: 8,
  },

  chatHeader: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatTitle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  chatTitleText: {
    fontSize: 16,
    fontWeight: "600",
  },

  chatDateRead: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatDate: {
    fontSize: 14,
    marginLeft: 4,
    color: colors.gray,
  },
  chatRead: {
    fontSize: 18,
    color: colors.green,
  },
  chatPinned: {
    fontSize: 20,
    color: colors.gray,
  },
  chatVerified: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 4,
  },
  chatMuted: {
    fontSize: 16,
    color: colors.gray,
    marginLeft: 4,
  },
  chatSavedMessages: {
    fontSize: 40,
    color: colors.white,

    textAlign: "center",
  },

  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatMessage: {
    flex: 1,
    height: 48,

    fontSize: 15,
    color: colors.gray,
  },
  chatUnreadCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 20,
    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.green,
  },
  chatUnreadCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },

  chatLoading: {
    marginVertical: 32,
    alignSelf: "center",
  },
});
