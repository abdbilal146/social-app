import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getMessaging } from "firebase-admin/messaging";

export const sendNotificationOnArrayUpdate = onDocumentUpdated("users/{userId}", async (event) => {

    if (!event.data) return;


    const previousData = event.data.before.data();
    const newData = event.data.after.data();
    let bodyText = ''


    const oldList = previousData.notifications || [];
    const newList = newData.notifications || [];


    if (newList.length <= oldList.length) {
        return;
    }


    const newNotification: string = newList[newList.length - 1];


    if (!newNotification) return;

    console.log("Nouvelle notification détectée :", newNotification);


    const splitNotification = newNotification.split("_")

    if (splitNotification[0] === 'friendRequest') {
        bodyText = "Vous avez une nouvelle demande d'ami"
    }
    else {
        bodyText = "Vous avez une nouvelle notification"
    }




    const fcmToken = newData.fcmToken;

    if (!fcmToken) {
        console.log("Pas de token FCM pour cet utilisateur.");
        return;
    }

    const message = {
        token: fcmToken,
        notification: {
            // Adaptez ces champs selon la structure de vos objets dans l'array
            title: "Nouvelle notification",
            body: bodyText,
        },
        data: {
            type: newNotification || "general",
            click_action: "FLUTTER_NOTIFICATION_CLICK"
        },
        android: { priority: "high" as const },
        apns: { payload: { aps: { sound: "default", badge: 1 } } },
    };

    // 8. Envoyer
    try {
        await getMessaging().send(message);
        console.log("Notification envoyée avec succès !");
    } catch (error) {
        console.error("Erreur d'envoi FCM:", error);
    }
});