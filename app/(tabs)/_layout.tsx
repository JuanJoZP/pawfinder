import { Tabs } from "expo-router"
import React from "react"
import { TabBarIcon } from "@/components/navigation/TabBarIcon"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite"
import { createTables, dropTables, insertDummy } from "@/database/schema"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <SQLiteProvider databaseName="database" onInit={migrateDbIfNeeded}>
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
    </SQLiteProvider>
  )
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1
  let { user_version: currentDbVersion } = (await db.getFirstAsync(
    "PRAGMA user_version"
  )) as { user_version: number }

  if (currentDbVersion >= DATABASE_VERSION) {
    return
  }
  if (currentDbVersion === 0) {
    await db.execAsync(dropTables)
    await db.execAsync(createTables)
    await db.execAsync(insertDummy)
    currentDbVersion = 1
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}
