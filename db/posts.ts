import { db } from "@/firebaseConfig";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, query, where } from "firebase/firestore";
import { Collections } from "@/constants/Collections";

export const listenToAllPosts = (callback: (posts: any[]) => void) => {
    const postsRef = collection(db, Collections.posts);
    return onSnapshot(postsRef, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    });
};

export const listenToUserPosts = (userId: string, callback: (posts: any[]) => void) => {
    const postsRef = collection(db, Collections.posts);

    const q = query(postsRef, where("uid", "==", userId));

    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    });
};

export const createPost = async (userId: string, content: string) => {
    const postRef = collection(db, Collections.posts);
    const newPostRef = doc(postRef);
    await setDoc(newPostRef, {
        uid: userId,
        likes: [],
        createdAt: serverTimestamp(),
        content: content
    });
};

export const deletePost = async (postId: string) => {
    const postRef = doc(db, Collections.posts, postId);
    await deleteDoc(postRef);
};

export const togglePostLike = async (postId: string, userId: string, currentLikes: string[]) => {
    const postRef = doc(db, Collections.posts, postId);
    if (currentLikes.includes(userId)) {
        await updateDoc(postRef, {
            likes: arrayRemove(userId)
        });
    } else {
        await updateDoc(postRef, {
            likes: arrayUnion(userId)
        });
    }
};
