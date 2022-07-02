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

  chatImage: {
    width: 64,
    height: 64,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    margin: 8,

    // backgroundColor: "red",
    borderRadius: 64,
  },
  chatInfo: {
    flex: 1,
    height: 80,

    // backgroundColor: "green",

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
    // padding: 16,
    width: 24,
    height: 24,
    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "green",
  },
  chatUnreadCountText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
