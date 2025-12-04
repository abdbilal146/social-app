import { Button, ButtonIcon } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { SearchIcon, TrashIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useState } from "react";
import { StyleSheet, View, FlatList, Text, Dimensions, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

const { height } = Dimensions.get("window");

export default function Search() {
    const [searchKeyWord, setSearchkeyWord] = useState<string>("");
    const [filtredSearchList, setFiltredSearchList] = useState<any[]>([]);

    const onSearch = () => {

    };

    const deleteSearch = () => {
        setSearchkeyWord("");
        setFiltredSearchList([]);
    };

    const renderSearchItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <Pressable>
                <View style={styles.renderSearchItemContainer}>
                    <Text style={{ color: Colors.text, fontWeight: "600" }}>{item.email}</Text>
                </View>
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <FormControl>
                    <Input style={styles.searchFieldStyle}>
                        <InputField
                            placeholder="rechercher"
                            style={styles.inputField}
                            onChangeText={setSearchkeyWord}
                            value={searchKeyWord}
                        />
                    </Input>
                </FormControl>
                <View style={styles.searchBtnContainerStyle}>
                    <Button style={styles.searchBtn} onPress={onSearch}>
                        <ButtonIcon fill={Colors.primary} color={Colors.white} as={SearchIcon} />
                    </Button>
                    <Button onPress={deleteSearch} style={styles.searchBtn}>
                        <ButtonIcon fill={Colors.primary} color={Colors.white} as={TrashIcon} />
                    </Button>
                </View>

                {filtredSearchList && (
                    <FlatList
                        data={filtredSearchList}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSearchItem}
                        style={{ maxHeight: 200 }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    searchContainer: {
        marginTop: height * 0.1,
        margin: 10,
        display: "flex",
        gap: 12
    },
    searchFieldStyle: {
        height: 40,
        borderRadius: 10,
        borderColor: Colors.primary,
    },
    searchBtnContainerStyle: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: "5%",
        alignItems: "center",
        justifyContent: "center"
    },
    searchBtn: {
        width: "45%",
        backgroundColor: Colors.primary
    },
    inputField: {
        color: Colors.text,
    },
    renderSearchItemContainer: {
        backgroundColor: "transparent",
        borderRadius: 12,
        padding: 10,
        margin: 5,
        borderBottomWidth: 1,
        height: 70,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        borderBottomColor: '#ccc',
    },
});