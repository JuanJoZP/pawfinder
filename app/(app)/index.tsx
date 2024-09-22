import { PostRender } from "@/components/PostItem"
import Feed from "@/components/Feed"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Post, User } from "@/database/types"
import { useSQLiteContext } from "expo-sqlite"
import * as FileSystem from "expo-file-system"
import { useAuth } from "@/hooks/useAuth"

export default function LostScreen() {
  const [posts, setPosts] = useState<PostRender[] | null>(null)
  const db = useSQLiteContext()
  const { userId } = useAuth()

  useEffect(() => {
    if (db) {
      const render_posts: PostRender[] = []

      const db_result = db.getAllSync("SELECT * FROM posts WHERE category_id=1") as Post[]

      db_result.forEach(dbPost => {
        const { username, avatar_url } = db.getFirstSync(
          `SELECT username, avatar_url FROM users WHERE id=${dbPost.user_id}`
        ) as User
        const count_likes = db.getFirstSync(
          `SELECT COUNT(*) FROM likes WHERE post_id=${dbPost.id}`
        ) as { "COUNT(*)": number }
        const likes = count_likes["COUNT(*)"]

        render_posts.push({
          id: dbPost.id.toString(),
          username: username,
          image: dbPost.image,
          avatar: avatar_url,
          likes: likes,
          caption: dbPost.caption,
        })
      })

      setPosts(render_posts)
    }
  }, [db])

  const handleCreatePost = async (caption: string, image: string) => {
    if (db) {
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const categoryId = 1

      try {
        const result = db.runSync(
          "INSERT INTO posts (user_id, category_id, caption, image) VALUES (?, ?, ?, ?)",
          [userId, categoryId, caption, base64Image]
        )

        if (result.changes && result.changes > 0) {
          const newPostId = result.lastInsertRowId
          const { username, avatar_url } = db.getFirstSync(
            `SELECT username, avatar_url FROM users WHERE id=${userId}`
          ) as User

          const newPost: PostRender = {
            id: newPostId.toString(),
            username: username,
            image: base64Image,
            avatar: avatar_url,
            likes: 0,
            caption: caption,
          }

          setPosts(prevPosts => (prevPosts ? [newPost, ...prevPosts] : [newPost]))
        } else {
          console.error("Failed to insert new post")
        }
      } catch (error) {
        console.error("Error creating post:", error)
      }
    }
  }

  if (!posts) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Feed posts_data={posts} title="Perdidos" handleCreatePost={handleCreatePost}></Feed>
  )
}
