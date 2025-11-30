import React, { ReactNode, useState } from "react";


interface ModalContextProps {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    body: ReactNode;
    setModalContent: (body: ReactNode) => void;
}

const ModalContext = React.createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const [body, setBody] = useState<ReactNode>(null)
    const setModalContent = (body: ReactNode) => setBody(body)

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal, setModalContent, body }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = React.useContext(ModalContext)
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider")
    }
    return context
}
