import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { listenToUser } from "@/db/users";

export default function TabsLayout() {
  const [userNotifications, setUserNotifications] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser)

  console.log("TabsLayout render. isAuthenticated:", isAuthenticated)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      if (!user) {
        setUserNotifications(undefined)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!auth.currentUser?.uid) return

    const unsub = listenToUser(auth.currentUser.uid, (data) => {
      setUserNotifications(data.notifications.length)
    })

    return () => unsub()
  }, [isAuthenticated])

  const homeIcon = () => <Ionicons name="home" size={24} />
  const personIcon = () => <Ionicons name="person" size={24} />
  const searchIcon = () => <Ionicons name="search" size={24} />
  const postsIcon = () => <MaterialCommunityIcons name="post-outline" size={24} />
  const messageIcon = () => <Feather name="message-circle" size={24} />
  const notificationsIcon = () => <Ionicons name="notifications" size={24} />

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          backgroundColor: "white",
          paddingTop: 6,
          height: 80
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: homeIcon }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: searchIcon }} />
      <Tabs.Screen
        name="myposts"
        options={{
          title: "My Posts",
          tabBarIcon: postsIcon,
          href: isAuthenticated ? undefined : null
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Messages",
          tabBarIcon: messageIcon,
          href: isAuthenticated ? undefined : null
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: notificationsIcon,
          tabBarBadge: userNotifications,
          href: isAuthenticated ? undefined : null
        }}
      />
      <Tabs.Screen name="account" options={{ title: "Profile", tabBarIcon: personIcon }} />
    </Tabs>
  );
}