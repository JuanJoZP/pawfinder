import { PostRender, Comment } from "@/components/PostItem";
import Feed from "@/components/Feed";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Post, User } from "@/database/types";
import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/hooks/useAuth";

export default function LostScreen() {
  const [posts, setPosts] = useState<PostRender[] | null>(null);
  const db = useSQLiteContext();
  const { userId } = useAuth();

  useEffect(() => {
    if (db) {
      const render_posts = db.getAllSync(
        `
        SELECT 
          p.id, 
          p.caption, 
          p.image, 
          u.username, 
          u.avatar_url as avatar, 
          COUNT(l.id) as likes,
          CASE WHEN ul.user_id IS NOT NULL THEN 1 ELSE 0 END as liked
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN likes l ON p.id = l.post_id
        LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ?
        WHERE p.category_id = 1
        GROUP BY p.id
      `,
        [userId]
      ) as PostRender[];

      const posts_comments = db.getAllSync(
        `SELECT p.id as post_id, c.id, u.username, c.content, c.created_at
        FROM comments c
        JOIN posts p ON p.id = c.post_id
        JOIN users u on c.user_id = u.id
        WHERE p.category_id = 1`
      ) as Comment[];

      render_posts.forEach((post, index) => {
        const commentsForPost = posts_comments.filter(
          (comment) => comment.post_id === post.id
        );
        render_posts[index].comments = commentsForPost.map((comment) => ({
          post_id: comment.post_id,
          id: comment.id,
          username: comment.username, // Assuming user_id is the username for simplicity
          content: comment.content,
          created_at: comment.created_at,
        }));
      });

      setPosts(render_posts);
    }
  }, [db]);

  const handleCreatePost = async (caption: string, image: string) => {
    if (db) {
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const categoryId = 1;

      try {
        const result = db.runSync(
          "INSERT INTO posts (user_id, category_id, caption, image) VALUES (?, ?, ?, ?)",
          [userId, categoryId, caption, base64Image]
        );

        if (result.changes && result.changes > 0) {
          const newPostId = result.lastInsertRowId;
          const { username, avatar_url } = db.getFirstSync(
            `SELECT username, avatar_url FROM users WHERE id=${userId}`
          ) as User;

          const newPost: PostRender = {
            id: newPostId.toString(),
            username: username,
            image: base64Image,
            avatar: avatar_url,
            likes: 0,
            caption: caption,
            liked: false,
            comments: [],
          };

          setPosts((prevPosts) =>
            prevPosts ? [newPost, ...prevPosts] : [newPost]
          );
        } else {
          console.error("Failed to insert new post");
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleComment = async (post_id: string, content: string) => {
    if (db) {
      try {
        const result = db.runSync(
          "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
          [post_id, userId, content]
        );

        if (result.changes && result.changes > 0) {
          const newCommentId = result.lastInsertRowId;

          // Fetch the username of the commenter
          const { username } = db.getFirstSync(
            "SELECT username FROM users WHERE id = ?",
            [userId]
          ) as { username: string };

          // Update the local state to reflect the new comment
          setPosts((prevPosts) =>
            prevPosts!.map((post) => {
              if (post.id === post_id) {
                return {
                  ...post,
                  comments: [
                    ...(post.comments || []),
                    {
                      post_id: post.id,
                      id: newCommentId.toString(),
                      username,
                      content,
                      created_at: new Date().toISOString(),
                    },
                  ],
                };
              }
              return post;
            })
          );
        } else {
          console.error("Failed to insert comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handlePutLike = async (post_id: string) => {
    try {
      const result = db.runSync(
        "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
        [userId, post_id]
      );

      if (result.changes && result.changes > 0) {
        // Update the local state to reflect the like
        setPosts((prevPosts) =>
          prevPosts!.map((post) =>
            post.id === post_id
              ? { ...post, likes: post.likes + 1, liked: true }
              : post
          )
        );
      } else {
        console.error("Failed to insert like");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleRemoveLike = async (post_id: string) => {
    try {
      const result = db.runSync(
        "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, post_id]
      );

      if (result.changes && result.changes > 0) {
        // Update the local state to reflect the removal of the like
        setPosts((prevPosts) =>
          prevPosts!.map((post) =>
            post.id === post_id
              ? { ...post, likes: post.likes - 1, liked: false }
              : post
          )
        );
      } else {
        console.error("Failed to remove like");
      }
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  if (!posts) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Feed
      posts_data={posts}
      title="Perdidos"
      handleCreatePost={handleCreatePost}
      handleComment={handleComment}
      handlePutLike={handlePutLike}
      handleRemoveLike={handleRemoveLike}
    ></Feed>
  );
}
