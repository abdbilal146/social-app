import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { PostCard } from "."
import { useEffect, useState } from "react"
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { auth, db } from "@/firebaseConfig"
import { Collections } from "@/constants/Collections"
import { useActionSheet } from "@/contexts/ActionSheetContext"


const { height, width } = Dimensions.get("window")

export default function MyPosts() {

    const [posts, setPosts] = useState<any[]>()
    const { closeActionSheet } = useActionSheet()
    const [deletePostBtnSpinner, setDeletePostBtnSpinner] = useState<boolean>(false)


    useEffect(() => {
        const postRef = collection(db, "posts")

        const unsubscribe = onSnapshot(postRef, (snapshot) => {
            const postsData: any[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            const userPosts = postsData.filter(doc => {
                return doc.uid === auth.currentUser?.uid
            })
            setPosts(userPosts)
            console.log(userPosts)
        })

        return () => unsubscribe()

    }, [])

    const addToFavorite = async (postId: any, likes: any[]) => {
        const posRef = doc(db, "posts", postId)
        const uid = auth.currentUser?.uid
        if (!uid) return

        try {
            if (likes.includes(uid)) {
                await updateDoc(posRef, {
                    likes: arrayRemove(uid)
                })
            } else {
                await updateDoc(posRef, {
                    likes: arrayUnion(uid)
                })
            }

        } catch (e) {
            console.log(e)
        }
    }

    const deletePost = async (postId: string) => {
        const postsCollection = collection(db, Collections.posts)
        const postRef = doc(postsCollection, postId)

        try {
            setDeletePostBtnSpinner(true)
            await deleteDoc(postRef)
        } catch (e) {
            console.log(e)
        } finally {
            closeActionSheet()
            setDeletePostBtnSpinner(false)
        }
    }

    return (
        <>
            <ScrollView style={styles.body}>
                <View style={styles.body}>
                    <View style={styles.postsContainerStyle}>
                        {posts?.map(post => {
                            let likes = post.likes || []
                            return <PostCard btnSpinner={deletePostBtnSpinner} onDeletePostPress={() => { deletePost(post.id) }} press={() => { addToFavorite(post.id, likes) }} key={post.id} content={post.content} likesCount={likes.length}></PostCard>
                        })}
                    </View>
                </View>
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "white", // Deep rich blue/black
    },

    postsContainerStyle: {
        marginTop: height * 0.1,
        paddingHorizontal: 16,
    },
})