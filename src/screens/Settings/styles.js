import colors from "../../styles/colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingTop: 64,
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 200,
  },
  logoTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  logoCaption: {
    color: colors.gray,
    marginBottom: 16,
  },

  input: {
    alignSelf: "stretch",

    marginHorizontal: 16,
    marginBottom: 4,

    paddingHorizontal: 16,
    paddingVertical: 16,

    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 16,
  },

  button: {
    alignSelf: "stretch",
    backgroundColor: colors.primary,

    marginHorizontal: 16,

    paddingHorizontal: 16,
    paddingVertical: 16,

    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.primary,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.white,

    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,

    fontSize: 16,
    fontWeight: "500",
  },
});
