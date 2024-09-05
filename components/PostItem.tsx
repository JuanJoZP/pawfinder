import { StyleSheet, Image, TouchableOpacity, View, Text } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Avatar } from "react-native-paper"

export type Post = {
  id: string
  username: string
  image: string
  avatar: string
  likes: number
  caption: string
}

export function PostItem({ username, avatar, image, likes, caption }: Post) {
  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Avatar.Image size={32} source={{ uri: avatar }} style={styles.postAvatar} />
        <Text style={styles.postUsername}>{username}</Text>
      </View>
      <Image source={{ uri: image }} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity>
          <Feather name="heart" size={24} color="black"></Feather>
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="message-circle" size={24} color="black"></Feather>
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="send" size={24} color="black"></Feather>
        </TouchableOpacity>
      </View>
      <Text style={styles.postLikes}>{likes} Likes</Text>
      <Text style={styles.postCaption}>
        <Text style={styles.postUsername}>{username}</Text> {caption}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  postItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  postAvatar: {
    marginRight: 10,
  },
  postUsername: {
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 400,
  },
  postActions: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  postLikes: {
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  postCaption: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
})
