import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native"
import { PostItem, PostRender } from "@/components/PostItem"
import { useState } from "react"
import { CreatePostModal } from "@/components/CreatePostModal"

interface FeedProps {
  posts_data: PostRender[]
  title: string
  handleCreatePost: (caption: string, image: string) => void
}

export default function Feed({ posts_data, title, handleCreatePost }: FeedProps) {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity onPress={() => setIsCreatePostModalOpen(true)}>
          <Text style={styles.newPostButton}>+ Post Nuevo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts_data}
        renderItem={({ item }) => <PostItem {...item} />}
        keyExtractor={item => item.id}
      />
      <CreatePostModal
        isVisible={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreatePost={handleCreatePost}
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
  newPostButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
})
