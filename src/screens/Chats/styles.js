import colors from "../../styles/colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
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

  chatInfo: {
    flex: 1,
    height: 80,

    // backgroundColor: "green",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",

    paddingRight: 8,
  },

  chatHeader: {
    height: 32,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // backgroundColor: "yellow",
  },
  chatTitle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",

    // backgroundColor: "red",
  },
  chatTitleText: {
    fontSize: 16,
    fontWeight: "600",
  },

  chatDateRead: {
    flexDirection: "row",
    alignItems: "center",

    // backgroundColor: "blue",
  },
  chatDate: {
    fontSize: 14,
    marginLeft: 4,
    color: "grey",
  },
  chatRead: {
    fontSize: 18,
    color: "green",
  },
  chatPinned: {
    fontSize: 18,
    color: "grey",
  },
  chatVerified: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 4,
  },
  chatSavedMessages: {
    fontSize: 40,
    color: colors.white,

    textAlign: "center",
  },

  chatFooter: {
    // backgroundColor: "purple",
    flexDirection: "row",

    alignItems: "center",
  },
  chatMessage: {
    height: 48,

    fontSize: 15,
    color: "grey",

    flex: 1,

    // backgroundColor: "aqua",
  },
  chatUnreadCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 20,
    paddingHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "green",
  },
  chatUnreadCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
