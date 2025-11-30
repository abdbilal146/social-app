import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Pressable, StyleSheet, Animated, Dimensions } from "react-native";

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
        backgroundColor: '#1c2b21',
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
