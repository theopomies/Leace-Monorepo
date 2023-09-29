import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getToken(key: string) {
  return await SecureStore.getItemAsync(key);
}

// SecureStore is not supported on the web
// https://github.com/expo/expo/issues/7744#issuecomment-611093485
export const tokenCache =
  Platform.OS !== "web"
    ? {
        getToken,
        saveToken,
      }
    : undefined;

const storage = new Map<string, boolean>();

export class LocalStorage {
  static setItem(key: string, value: boolean): void {
    storage.set(key, value);
  }
  static getItem(key: string): boolean {
    return storage.get(key) ?? false;
  }
  static removeItem(key: string): void {
    storage.delete(key);
  }
  static clear(): void {
    storage.clear();
  }
}
