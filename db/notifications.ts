import { db } from "@/firebaseConfig";
import { collection, doc, updateDoc } from "firebase/firestore";
import { registerForPushNotificationsAsync } from "@/notifications";
import { Collections } from "@/constants/Collections";
import { listenToUser } from "./users";

export const saveUserToken = async (collectionName: string, userId: string) => {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;

    const usersCollection = collection(db, collectionName);
    const userRef = doc(usersCollection, userId);

    await updateDoc(userRef, {
        fcmToken: token
    });
};


