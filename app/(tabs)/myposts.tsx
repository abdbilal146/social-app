import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { PostCard } from "."
import { useEffect, useState } from "react"
import { auth } from "@/firebaseConfig"
import { useActionSheet } from "@/contexts/ActionSheetContext"
import { deletePost, listenToUserPosts, togglePostLike } from "@/db/posts"


const { height, width } = Dimensions.get("window")

export default function MyPosts() {

    const [posts, setPosts] = useState<any[]>()
    const { closeActionSheet } = useActionSheet()
    const [deletePostBtnSpinner, setDeletePostBtnSpinner] = useState<boolean>(false)


    useEffect(() => {
        const uid = auth.currentUser?.uid
        if (!uid) return

        const unsubscribe = listenToUserPosts(uid, (userPosts) => {
            setPosts(userPosts)
            console.log(userPosts)
        })

        return () => unsubscribe()

    }, [])

    const addToFavorite = async (postId: any, likes: any[]) => {
        const uid = auth.currentUser?.uid
        if (!uid) return

        try {
            await togglePostLike(postId, uid, likes)
        } catch (e) {
            console.log(e)
        }
    }

    const deletePostFunc = async (postId: string) => {
        try {
            setDeletePostBtnSpinner(true)
            await deletePost(postId)
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
                            return <PostCard btnSpinner={deletePostBtnSpinner} onDeletePostPress={() => { deletePostFunc(post.id) }} press={() => { addToFavorite(post.id, likes) }} key={post.id} content={post.content} likesCount={likes.length}></PostCard>
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