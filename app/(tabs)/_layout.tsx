import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const homeIcon = () => <Ionicons size={30} name="home"></Ionicons>;
  const personIcon = () => <Ionicons size={30} name="person"></Ionicons>;

  const searchIcon = () => <Ionicons size={30} name="search"></Ionicons>;

  return (
    <Tabs >
      <Tabs.Screen

        name="index"
        options={{
          tabBarIcon: homeIcon,
          title: "Home",

        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: searchIcon,
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: personIcon,
          title: "Account",
          headerShown: false
        }}
      />
    </Tabs>
  );
}
