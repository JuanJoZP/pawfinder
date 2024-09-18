import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack, useSegments, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite"
import { createTables, dropTables, insertDummy } from "@/database/schema"

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const segments = useSegments()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const isAuthGroup = segments[0] === "(auth)"
    if (!isAuthGroup && !isAuthenticated) {
      router.replace("/login")
    } else if (isAuthGroup && isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, segments])

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </ThemeProvider>
  )
}

export default function RootLayout() {
  const [isFontsReady] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (isFontsReady) {
      SplashScreen.hideAsync()
    }
  }, [isFontsReady])

  if (!isFontsReady) {
    return null
  }

  return (
    <SQLiteProvider databaseName="database" onInit={migrateDbIfNeeded}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
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
