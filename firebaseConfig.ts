import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
    apiKey: "AIzaSyBYV2_2vvlgivGzAjsXRJE-5mF-AaggsgM",
    authDomain: "student-social-app-c5231.firebaseapp.com",
    projectId: "student-social-app-c5231",
    storageBucket: "student-social-app-c5231.firebasestorage.app",
    messagingSenderId: "984961561788",
    appId: "1:984961561788:web:e715f049c9477b2bc50cb9",
    measurementId: "G-BCVLHED1EW"
}


const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)