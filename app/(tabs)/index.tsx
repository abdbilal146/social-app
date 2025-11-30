import { Fab, FabIcon } from "@/components/ui/fab";
import { EditIcon } from "@/components/ui/icon";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window")


export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <Fab style={styles.fabBtnStyle} placement="bottom right" isHovered={false} isDisabled={false} isPressed={false}>
                <FabIcon as={EditIcon} />
            </Fab>
        </View>
    )
}


const styles = StyleSheet.create({
    fabBtnStyle: {
        width: width * 0.15,
        height: height * 0.07,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
        marginBottom: 15,
    }
})