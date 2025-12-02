import { db } from "@/firebaseConfig"
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore"

export const sendMessage = async (chatId: any, userId: any, text: any) => {
    // Create or update the parent chat document
    await setDoc(doc(db, "chats", chatId), {
        lastMessage: text,
        updatedAt: serverTimestamp()
    }, { merge: true })

    // Add the message to the subcollection
    await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId: userId,
        createdAt: serverTimestamp()
    })
}

export const listenMessages = (chatId: any, callback: any) => {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    )

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        callback(messages)
    })
}