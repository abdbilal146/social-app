import * as ImagePicker from "expo-image-picker"


export async function pickImage() {
    const hasPermission = await askMediaPermission()

    if (!hasPermission) return null

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
    })

    if (!result.canceled) {
        return result.assets[0].uri
    }

    return null
}



export async function uriToBlob(uri: any) {
    const response = await fetch(uri)
    const blob = response.blob()
    return blob
}



async function askMediaPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === "granted"
}


