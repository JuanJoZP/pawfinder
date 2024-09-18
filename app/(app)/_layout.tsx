import { Tabs } from "expo-router"
import React from "react"
import { TabBarIcon } from "@/components/navigation/TabBarIcon"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { useAuth } from "@/hooks/useAuth"
import { Redirect } from "expo-router"

export default function AppLayout() {
  const colorScheme = useColorScheme()

  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Perdidos",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search" : "search-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="found"
        options={{
          title: "Encontrados",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "paw" : "paw-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="adopted"
        options={{
          title: "Adoptados",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
