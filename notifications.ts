import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { saveUserToken } from "./db/notifications";


export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) return null

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus


    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== "granted") return null

    // Switch to Device Token for Firebase Admin SDK compatibility
    const tokenData = await Notifications.getDevicePushTokenAsync()
    console.log("Device Token Type:", tokenData.type);
    return tokenData.data
}


export async function saveToken(collectionName: string, userId: string) {
    await saveUserToken(collectionName, userId);
}