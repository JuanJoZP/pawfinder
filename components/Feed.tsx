import { StyleSheet, View, Text, FlatList, SafeAreaView, StatusBar } from "react-native"
import { Avatar } from "react-native-paper"
import { useAssets } from "expo-asset"
import { PostItem, Post } from "@/components/PostItem"

export default function Feed({
  posts_data,
  title,
}: {
  posts_data: Post[]
  title: string
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Pawfinder {title}</Text>
        <Avatar.Image size={48} source={require("../assets/images/logo.png")} />
      </View>
      <FlatList
        data={posts_data}
        renderItem={({ item }) => <PostItem {...item} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
})
