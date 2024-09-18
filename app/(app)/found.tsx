import { PostRender } from "@/components/PostItem"
import Feed from "@/components/Feed"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Post, User } from "@/database/types"
import { useSQLiteContext } from "expo-sqlite"

export default function FoundScreen() {
  const [posts, setPosts] = useState<PostRender[] | null>(null)
  const db = useSQLiteContext()
  useEffect(() => {
    if (db) {
      const render_posts: PostRender[] = []

      const db_result = db.getAllSync("SELECT * FROM posts WHERE category_id=3") as Post[]
      db_result.forEach(dbPost => {
        const { username, avatar_url } = db.getFirstSync(
          `SELECT username, avatar_url FROM users WHERE id=${dbPost.user_id}`
        ) as User
        const count_likes = db.getFirstSync(
          `SELECT COUNT(*) FROM likes WHERE post_id=${dbPost.id}`
        ) as { "COUNT(*)": number }
        const likes = count_likes["COUNT(*)"]
        console.log(dbPost.image_url)

        render_posts.push({
          id: dbPost.id.toString(),
          username: username,
          image: dbPost.image_url,
          avatar: avatar_url,
          likes: likes,
          caption: dbPost.caption,
        })
      })

      setPosts(render_posts)
    }
  }, [db])

  if (!posts) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <Feed posts_data={posts} title="Encontrados"></Feed>
}
