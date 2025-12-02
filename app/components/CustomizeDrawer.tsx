import React from 'react';
import { Modal, Pressable, StyleSheet, Dimensions } from "react-native";
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6; // Drawer takes 80% of screen width

export default function CustomizeDrawer({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={styles.drawer}
                    onPress={(e) => e.stopPropagation()}
                >
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align drawer to the left
    },
    drawer: {
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: Colors.background,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
