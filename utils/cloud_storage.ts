import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { uriToBlob } from "./image_functions";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";


export async function uploadProfileImageToCloud(userId: any, uri: any) {

    const storage = getStorage();
    const storageRef = ref(storage, `profiles/${userId}.jpg`);

    const blob = await uriToBlob(uri)

    await uploadBytes(storageRef, blob)


    const downloadUrl = await getDownloadURL(storageRef)

    return downloadUrl

}


export async function saveUrlToFirestore(userId: any, url: any) {

    const users = collection(db, "users");
    const userRef = doc(users, userId);

    await updateDoc(userRef, {
        profilePictureUrl: url
    })

}