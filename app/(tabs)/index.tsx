import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon } from "@/components/ui/fab";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { EditIcon, FavouriteIcon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useModal } from "@/contexts/ModalContext";
import { auth, db } from "@/firebaseConfig";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window")


export default function Index() {
    const { openModal, setModalContent } = useModal()

    const showModalF = () => {
        setModalContent(
            <ModalBody />
        )
        openModal()
        console.log("Hello")
    }

    return (
        <View style={{ flex: 1 }}>
            <PostCard></PostCard>
            <Fab style={styles.fabBtnStyle} placement="bottom right" isHovered={false} isDisabled={false} isPressed={false} onPress={showModalF}>
                <FabIcon as={EditIcon} />
            </Fab>
        </View>
    )
}


function ModalBody() {
    const textareaPlaceholder: string = "publier quelque chose"
    const buttonLabel: string = "Publier"
    const { closeModal } = useModal()
    const [textareaValue, setTextareaValue] = useState<string>()

    const addPost = async () => {
        try {

            const postRef = collection(db, "posts")
            const newPostRef = doc(postRef)

            await setDoc(newPostRef, {
                uid: auth.currentUser?.uid!,
                createdAt: serverTimestamp(),
                content: textareaValue
            })


        } catch (e) {
            console.log(e)
        } finally {
            closeModal()
        }
    }

    return (
        <View style={styles.modalContainerStyle}>
            <FormControl style={styles.textAreaStyle}>
                <FormControlLabel>
                    <FormControlLabelText>Publier</FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                    <TextareaInput onChangeText={setTextareaValue} value={textareaValue} placeholder={textareaPlaceholder}></TextareaInput>
                </Textarea>
            </FormControl>
            <Button onPress={addPost}>
                <ButtonText>{buttonLabel}</ButtonText>
            </Button>
        </View>

    )
}



function PostCard() {
    return (
        <Card style={styles.postCardStyle} variant="outline">
            <VStack style={styles.cardContainer}>
                <View style={styles.postCardTextContainer}>
                    <Text>Hello</Text>
                </View>
                <HStack style={styles.postCardActionsContainer}>
                    <Button variant="outline">
                        <ButtonIcon as={FavouriteIcon}></ButtonIcon>
                    </Button>
                </HStack>
            </VStack>
        </Card>
    )
}


const styles = StyleSheet.create({
    modalContainerStyle: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    fabBtnStyle: {
        width: width * 0.15,
        height: height * 0.07,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
        marginBottom: 15,
    },
    textAreaStyle: {
        width: "90%"
    },

    // Post Card 
    postCardStyle: {
        margin: 12,
    },

    cardContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
    },

    postCardActionsContainer: {
        display: "flex",
        justifyContent: "flex-end",
        width: "90%",
    },
    postCardTextContainer: {
        width: "90%",
        backgroundColor: "black"
    }
})