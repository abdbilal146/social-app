import { StyleSheet, Text, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

export default function AdMob() {
    return (
        <View style={styles.adContainer}>
            {/* Sponsored Header */}
            <View style={styles.sponsoredHeader}>
                <Text style={styles.sponsoredText}>📢 Sponsorisé</Text>
            </View>

            {/* Ad Content */}
            <View style={styles.adContent}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    size={BannerAdSize.MEDIUM_RECTANGLE}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdFailedToLoad={(error) => console.log("Ad failed to load:", error)}
                />
            </View>

            {/* Footer */}
            <View style={styles.adFooter}>
                <View style={styles.adBadge}>
                    <Text style={styles.adBadgeText}>Annonce</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    adContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(63, 114, 175, 0.1)",
    },
    sponsoredHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F9F7F7",
    },
    sponsoredText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#565656",
        opacity: 0.7,
        letterSpacing: 0.3,
    },
    adContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        backgroundColor: "#F9F7F7",
    },
    adFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#F9F7F7",
    },
    adBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(63, 114, 175, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    adBadgeText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#3F72AF",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});