import { Text, View } from "react-native";
import { AdMobBanner } from "expo-ads-admob"



export default function AdMob() {
    return (
        <View style={{ padding: 10, alignItems: 'center' }}>
            <AdMobBanner
                bannerSize="mediumRectangle"
                adUnitID="ca-app-pub-3940256099942544/6300978111"
                servePersonalizedAds={false}
                onDidFailToReceiveAdWithError={(err) => console.log(err)}
            >

            </AdMobBanner>
            <Text style={{ opacity: 0.6, marginTop: 5 }}>Sponsored</Text>
        </View>
    )
}