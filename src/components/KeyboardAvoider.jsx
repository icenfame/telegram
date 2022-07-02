// ======================
// iOS Keyboard Avoider
// ======================
import React, { useEffect, useRef } from "react";
import {
  Keyboard,
  View,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

export default function KeyboardAvoider(props) {
  const anim = useRef(new Animated.Value(0)).current;
  const animationParams = {
    duration: 500,
    useNativeDriver: false,
    easing: Easing.bezier(0.38, 0.7, 0.125, 1.0), // From https://developer.apple.com/forums/thread/48088
  };
  const debug = false;

  useEffect(() => {
    const keyboardWillShowSubscribe = Keyboard.addListener(
      "keyboardWillShow",
      (e) => {
        if (debug) console.log("Keyboard will show");

        Animated.timing(anim, {
          toValue: e.endCoordinates.height + (props.topSpacing ?? 0),
          ...animationParams,
        }).start();
      }
    );

    const keyboardWillHideSubscribe = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        if (debug) console.log("Keyboard will hide");

        Animated.timing(anim, {
          toValue: 0,
          ...animationParams,
        }).start();
      }
    );

    return () => {
      keyboardWillShowSubscribe.remove();
      keyboardWillHideSubscribe.remove();
    };
  });

  return props.hasScrollable === true ? (
    <View style={[props.style, { alignSelf: "stretch" }]}>
      {props.children}
      {Platform.OS === "ios" ? (
        <Animated.View style={{ height: anim }}></Animated.View>
      ) : null}
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[props.style, { alignSelf: "stretch" }]}>
        {props.children}
        {Platform.OS === "ios" ? (
          <Animated.View style={{ height: anim }}></Animated.View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}
