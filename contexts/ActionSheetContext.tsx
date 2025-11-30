import React, { ReactNode, useState } from "react";


interface ActionSheetContextProps {
    isOpen: boolean;
    openActionSheet: () => void;
    closeActionSheet: () => void;
    body: ReactNode;
    setBodyContent: (body: ReactNode) => void;
}

const ActionSheetContext = React.createContext<ActionSheetContextProps | undefined>(undefined);

export function ActionSheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const openActionSheet = () => setIsOpen(true)
    const closeActionSheet = () => setIsOpen(false)
    const [body, setBody] = useState<ReactNode>(null)
    const setBodyContent = (body: ReactNode) => setBody(body)

    return (
        <ActionSheetContext.Provider value={{ isOpen, openActionSheet, closeActionSheet, setBodyContent, body }}>
            {children}
        </ActionSheetContext.Provider>
    )
}

export function useActionSheet() {
    const context = React.useContext(ActionSheetContext)
    if (!context) {
        throw new Error("useSheetContext must be used within a SheetProvider")
    }
    return context
}