import { db } from "@/firebaseConfig";
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { Collections } from "@/constants/Collections";

export const listenToUser = (userId: string, callback: (data: any) => void) => {
    const userRef = doc(db, Collections.users, userId);
    return onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data());
        } else {
            callback(null);
        }
    });
};

export const getAllUsers = (callback: (users: any[]) => void) => {
    const usersRef = collection(db, Collections.users);
    return onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(users);
    });
};

export const createUser = async (userId: string, email: string | null) => {
    await setDoc(doc(db, Collections.users, userId), {
        uid: userId,
        email: email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
    });
};

export const updateUser = async (userId: string, data: any) => {
    const userRef = doc(db, Collections.users, userId);
    await updateDoc(userRef, data);
};

export const deleteUserDocument = async (userId: string) => {
    const userRef = doc(db, Collections.users, userId);
    await deleteDoc(userRef);
};


export const addfriend = async (userId: string, currentUserId: string) => {
    const userRef = doc(db, Collections.users, currentUserId);
    await updateDoc(userRef, {
        friends: arrayUnion(userId)
    })
}
