import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { uriToBlob } from "./image_functions";
import { updateUser } from "@/db/users";


export async function uploadProfileImageToCloud(userId: any, uri: any) {

    const storage = getStorage();
    const storageRef = ref(storage, `profiles/${userId}.jpg`);

    const blob = await uriToBlob(uri)

    await uploadBytes(storageRef, blob)


    const downloadUrl = await getDownloadURL(storageRef)

    return downloadUrl

}


export async function saveUrlToFirestore(userId: any, url: any) {
    await updateUser(userId, {
        profilePictureUrl: url
    });
}