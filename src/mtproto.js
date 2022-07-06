import MTProto from "@mtproto/core/envs/browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { TextEncoder, TextDecoder } from "web-encoding";

polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);

class CustomStorage {
  set(key, value) {
    console.log("SET", key, value);
    return AsyncStorage.setItem(key, value);
  }

  get(key) {
    console.log("GET", key);
    return AsyncStorage.getItem(key);
  }
}

export default new MTProto({
  api_id: process.env.API_ID,
  api_hash: process.env.API_HASH,
  storageOptions: {
    instance: new CustomStorage(),
  },
});
