import React, { ReactNode, useState } from "react";

interface DrawerContextProps {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    body: ReactNode;
    setDrawerContent: (body: ReactNode) => void;
}

const DrawerContext = React.createContext<DrawerContextProps | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const openDrawer = () => setIsOpen(true)
    const closeDrawer = () => setIsOpen(false)
    const [body, setBody] = useState<ReactNode>(null)
    const setDrawerContent = (body: ReactNode) => setBody(body)

    return (
        <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, body, setDrawerContent }}>
            {children}
        </DrawerContext.Provider>
    )
}

export function useDrawer() {
    const context = React.useContext(DrawerContext)
    if (!context) {
        throw new Error("useDrawer must be used within a DrawerProvider")
    }
    return context
}
