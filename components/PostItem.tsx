import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

export interface Comment {
  post_id: string;
  id: string;
  username: string;
  content: string;
  created_at: string;
}

export type PostRender = {
  id: string;
  username: string;
  image: string;
  avatar: string;
  likes: number;
  caption: string;
  liked: boolean;
  comments: Comment[];
};

interface PostItemProps {
  post_data: PostRender;
  handleRemoveLike: (post_id: string) => void;
  handlePutLike: (post_id: string) => void;
  handleComment: (post_id: string, content: string) => void;
}
// recibir otra prop llamada liked
// if liked cambiar estilos del icono de corazon: rojo
// recibe handleLike, creado desde index, adopted etc
// recibe comments: Comment[]
// abajo renderiza comments
// crea handleComment, desde parent
// boton comment tooglea un input y un boton de enviar
// enviar -> handleComment

export function PostItem({
  post_data: { avatar, caption, id, image, likes, username, liked, comments },
  handleComment,
  handlePutLike,
  handleRemoveLike,
}: PostItemProps) {
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  return (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <Avatar.Image
          size={32}
          source={{ uri: avatar }}
          style={styles.postAvatar}
        />
        <Text style={styles.postUsername}>{username}</Text>
      </View>
      <Image
        source={{ uri: `data:image/jpeg;base64,${image}` }}
        style={styles.postImage}
      />
      <View style={styles.postActions}>
        <TouchableOpacity
          onPress={() => {
            if (liked) {
              handleRemoveLike(id);
            } else {
              handlePutLike(id);
            }
          }}
        >
          <Feather
            name="heart"
            size={24}
            color={liked ? "red" : "black"}
          ></Feather>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            toggleCommentBox();
          }}
        >
          <Feather name="message-circle" size={24} color="black"></Feather>
        </TouchableOpacity>
      </View>
      {showCommentBox && (
        <View style={styles.commentBoxContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Añade un comentario..."
            multiline
            onChangeText={(newText) => setCommentContent(newText)}
            defaultValue={commentContent}
          />
          <TouchableOpacity
            style={styles.commentSubmitButton}
            onPress={() => {
              handleComment(id, commentContent);
              setShowCommentBox(false);
            }}
          >
            <Text style={styles.commentSubmitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.postLikes}>{likes} Likes</Text>
      <Text style={styles.postCaption}>
        <Text style={styles.postUsername}>{username}</Text> {caption}
      </Text>
      {comments && comments.length > 0 && (
        <View style={styles.postComments}>
          {comments.length > 1 ? (
            <>
              <Text style={styles.postComment}>
                <Text style={styles.postUsername}>{comments[0].username}</Text>:{" "}
                {comments[0].content}
              </Text>
              {showAllComments && (
                <>
                  {comments.slice(1).map((comment) => (
                    <Text key={comment.id} style={styles.postComment}>
                      <Text style={styles.postUsername}>
                        {comment.username}
                      </Text>
                      : {comment.content}
                    </Text>
                  ))}
                </>
              )}
              <TouchableOpacity
                onPress={() => setShowAllComments(!showAllComments)}
              >
                <Text style={styles.showMore}>
                  {showAllComments ? "Mostrar menos" : "Mostrar más"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.postComment}>
              <Text style={styles.postUsername}>{comments[0].username}</Text>:{" "}
              {comments[0].content}
            </Text>
          )}
        </View>
      )}
    </View>
  );
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
  commentBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dbdbdb",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  commentSubmitButton: {
    backgroundColor: "#3897f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentSubmitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postComment: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginVertical: 5,
  },
  postComments: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginVertical: 5,
  },
  showMore: {
    color: "#141414",
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});
