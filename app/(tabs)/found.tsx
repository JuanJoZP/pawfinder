import { Post } from "@/components/PostItem"
import Feed from "@/components/Feed"

const POSTS: Post[] = [
  {
    id: "1",
    username: "john_doe",
    image: "https://picsum.photos/400",
    avatar: "https://picsum.photos/31",
    likes: 1234,
    caption: "Beautiful day!",
  },
  {
    id: "2",
    username: "jane_smith",
    image: "https://picsum.photos/401",
    avatar: "https://picsum.photos/32",
    likes: 4321,
    caption: "Living my best life",
  },
  {
    id: "3",
    username: "bob_johnson",
    image: "https://picsum.photos/402",
    avatar: "https://picsum.photos/33",
    likes: 987,
    caption: "Adventure time!",
  },
]

export default function FoundScreen() {
  return <Feed posts_data={POSTS} title="encontrados"></Feed>
}
