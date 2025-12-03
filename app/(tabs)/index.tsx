import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Fab, FabIcon } from "@/components/ui/fab";
import { FormControl } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { EditIcon, FavouriteIcon, MessageCircleIcon, PaperclipIcon, ThreeDotsIcon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useActionSheet } from "@/contexts/ActionSheetContext";
import { useModal } from "@/contexts/ModalContext";
import { auth, db } from "@/firebaseConfig";
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spinner } from "@/components/ui/spinner";

const { width, height } = Dimensions.get("window")

export default function Index() {
    const { openActionSheet, setBodyContent } = useActionSheet()
    const [posts, setPosts] = useState<any[]>()

    const showModalF = () => {
        setBodyContent(
            <ModalBody />
        )
        openActionSheet()
        console.log("Hello")
    }

    useEffect(() => {
        const postRef = collection(db, "posts")

        const unsubscribe = onSnapshot(postRef, (snapshot) => {
            const postsData: any[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setPosts(postsData)
            console.log(postsData)
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

    return (
        <>
            <ScrollView style={styles.body}>
                <View style={styles.body}>

                    <View style={styles.postsContainerStyle}>
                        {posts?.map(post => {
                            let likes = post.likes || []
                            return <Fragment key={post.id}><PostCard btnSpinner={false} onDeletePostPress={() => { console.log("Hellow world") }} press={() => { addToFavorite(post.id, likes) }} content={post.content} likesCount={likes.length}></PostCard><Divider style={styles.postDividerBottomStyle}></Divider></Fragment>
                        })}
                    </View>


                </View>
            </ScrollView>
            <Fab style={styles.fabBtnStyle} placement="bottom right" isHovered={false} isDisabled={false} isPressed={false} onPress={showModalF}>
                <FabIcon as={EditIcon} />
            </Fab>

        </>
    )
}


function ModalBody() {
    const textareaPlaceholder: string = "Partagez vos pensées, idées ou actualités..."
    const buttonLabel: string = "Publier"
    const imageButtonLabel: string = "Ajouter une photo"
    const { closeActionSheet } = useActionSheet()
    const [textareaValue, setTextareaValue] = useState<string>("")
    const maxCharacters = 500

    const addPost = async () => {
        if (!textareaValue || textareaValue.trim().length === 0) return

        try {
            const postRef = collection(db, "posts")
            const newPostRef = doc(postRef)

            await setDoc(newPostRef, {
                uid: auth.currentUser?.uid!,
                likes: [],
                createdAt: serverTimestamp(),
                content: textareaValue
            })
        } catch (e) {
            console.log(e)
        } finally {
            closeActionSheet()
        }
    }

    return (
        <View style={styles.modalContainerStyle}>
            <View style={styles.modalHeaderContainer}>
                <View style={styles.modalHeaderIconContainer}>
                    <EditIcon color={Colors.primary} />
                </View>
                <Text style={styles.modalHeaderTitle}>Créer une publication</Text>
                <Text style={styles.modalHeaderSubtitle}>Partagez quelque chose avec votre communauté</Text>
            </View>

            <FormControl style={styles.textAreaStyle}>
                <Textarea style={styles.modernTextarea}>
                    <TextareaInput
                        onChangeText={setTextareaValue}
                        value={textareaValue}
                        placeholder={textareaPlaceholder}
                        style={styles.textareaInput}
                        maxLength={maxCharacters}
                        multiline
                        numberOfLines={6}
                    />
                </Textarea>
                <View style={styles.characterCountContainer}>
                    <Text style={styles.characterCountText}>
                        {textareaValue?.length || 0} / {maxCharacters}
                    </Text>
                </View>
            </FormControl>

            <Button
                onPress={addPost}
                style={styles.modernPublishButton}
                isDisabled={!textareaValue || textareaValue.trim().length === 0}
            >
                <ButtonText style={styles.publishButtonText}>{buttonLabel}</ButtonText>
                <ButtonIcon as={EditIcon} color={Colors.white} />
            </Button>



            <Button
                onPress={addPost}
                style={styles.modernPublishButton}
                isDisabled={!textareaValue || textareaValue.trim().length === 0}
            >
                <ButtonText style={styles.publishButtonText}>{imageButtonLabel}</ButtonText>
                <ButtonIcon as={PaperclipIcon} color={Colors.white} />
            </Button>
        </View>
    )
}

export function PostCard({ content, press, likesCount, onDeletePostPress, btnSpinner }: { content: string, press: () => void, likesCount: number, onDeletePostPress: () => void, btnSpinner: boolean }) {
    const { openActionSheet, setBodyContent } = useActionSheet()

    const showDrawer = () => {
        setBodyContent(<PostDrawerBody btnSpinner={btnSpinner} onDeletePostPress={onDeletePostPress} ></PostDrawerBody>)
        openActionSheet()
    }
    return (
        <Card style={styles.postCardStyle} variant="outline">
            <VStack style={styles.cardContainer}>

                <View style={styles.threedDotsBtnStyleContainer}>
                    <Button onPress={() => { showDrawer() }} style={{ backgroundColor: 'transparent' }}>
                        <ButtonIcon color="black" as={ThreeDotsIcon}></ButtonIcon>
                    </Button>
                </View>

                <View style={styles.postCardTextContainer}>
                    <Text style={styles.postCardContentTextStyle}>{content}</Text>
                </View>
                <HStack style={styles.postCardActionsContainer}>
                    <Button style={{ backgroundColor: 'transparent' }} >
                        <ButtonIcon as={MessageCircleIcon}></ButtonIcon>
                    </Button>
                    <Button style={{ backgroundColor: 'transparent' }} onPress={press} >
                        <ButtonIcon as={FavouriteIcon}></ButtonIcon>
                        <ButtonText style={styles.favouriteNumberTextStyle}>{likesCount}</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </Card>
    )
}


function PostDrawerBody({ onDeletePostPress, btnSpinner }: { onDeletePostPress: () => void, btnSpinner: boolean }) {


    return (
        <View style={styles.postDrawerBodyContainerStyle}>
            <Pressable style={styles.postDrawerPressableItemStyle} onPress={() => { onDeletePostPress() }}>{
                btnSpinner ? <Spinner></Spinner> : <Text style={styles.postDrawerPressableTextStyle}>Supprimer l'annonce</Text>
            }</Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    postsContainerStyle: {
        marginTop: height * 0.1,
        paddingHorizontal: 16,
    },
    modalContainerStyle: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    modalHeaderContainer: {
        alignItems: "center",
        marginBottom: 24,
        gap: 8,
    },
    modalHeaderIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${Colors.primary}15`,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    modalHeaderTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.text,
        textAlign: "center",
    },
    modalHeaderSubtitle: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.text,
        opacity: 0.6,
        textAlign: "center",
    },
    fabBtnStyle: {
        width: width * 0.15,
        height: height * 0.07,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.1,
        marginRight: 15,
        marginBottom: 15,
        backgroundColor: Colors.primary,
    },
    textAreaStyle: {
        width: "100%",
        marginBottom: 12,
    },
    modernTextarea: {
        minHeight: 150,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.lightBlue,
        backgroundColor: Colors.white,
        padding: 12,
    },
    textareaInput: {
        fontSize: 16,
        color: Colors.text,
        lineHeight: 24,
    },
    characterCountContainer: {
        alignItems: "flex-end",
        marginTop: 8,
        paddingRight: 4,
    },
    characterCountText: {
        fontSize: 12,
        color: Colors.text,
        opacity: 0.5,
        fontWeight: "500",
    },
    modernPublishButton: {
        backgroundColor: Colors.primary,
        marginTop: 40,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        height: height * 0.05
    },
    publishButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.white,
    },

    // Post Card 
    postCardStyle: {
        marginVertical: 8,
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.lightBlue,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },

    postCardContentTextStyle: {
        color: Colors.text,
        fontFamily: "sans-serif",
        fontSize: 16,
        lineHeight: 24,
    },

    cardContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12
    },

    postCardActionsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.lightBlue,
        paddingTop: 12,
        marginTop: 12,
    },
    postCardTextContainer: {
        width: "100%",
    },
    favouriteNumberTextStyle: {
        color: Colors.text,
        fontWeight: "600",
        marginLeft: 4,
    },
    threedDotsBtnStyleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    postDividerBottomStyle: {
        backgroundColor: Colors.lightBlue,
        height: 1,
        width: "90%",
        alignSelf: "center",
        marginVertical: 8,
        opacity: 0.5
    },
    postDrawerBodyContainerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    postDrawerPressableItemStyle: {
        backgroundColor: Colors.primary,
        width: "90%",
        height: height * 0.05,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12
    },
    postDrawerPressableTextStyle: {
        fontSize: 16,
        color: Colors.white
    }
})