import { PostRender } from "@/components/PostItem";
import Feed from "@/components/Feed";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/hooks/useAuth";

export default function AdoptedScreen() {
  const [posts, setPosts] = useState<PostRender[] | null>(null);
  const { userId } = useAuth();
  const categoryId = 3;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `https://pawfinder-api.onrender.com/posts?category_id=${categoryId}&user_id=${userId}`
      );
      const render_posts = await response.json();

      for (const post of render_posts) {
        const commentsResponse = await fetch(
          `https://pawfinder-api.onrender.com/posts/${post.id}/comments`
        );
        const posts_comments = await commentsResponse.json();

        post.comments = posts_comments; // Directly assign comments to the post
      }
      setPosts(render_posts);
    };

    fetchPosts(); // Call the async function
  }, [userId]); // Add userId as a dependency

  const handleCreatePost = async (caption: string, image: string) => {
    // Convert the image to base64
    const base64Image = await FileSystem.readAsStringAsync(image, {
      encoding: FileSystem.EncodingType.Base64,
    });

    try {
      const response = await fetch("https://pawfinder-api.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          category_id: categoryId,
          caption: caption,
          image: base64Image,
        }),
      });

      if (response.ok) {
        const { message, id, username, avatar_url } = await response.json(); // Get the ID from the response
        const newPost: PostRender = {
          id: id.toString(), // Use the ID returned from the API
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
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleComment = async (post_id: string, content: string) => {
    try {
      const response = await fetch(
        "https://pawfinder-api.onrender.com/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: post_id,
            user_id: userId,
            content: content,
          }),
        }
      );

      if (response.ok) {
        const { id, username } = await response.json(); // Get the new comment ID and username from the response

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
                    id: id.toString(), // Use the ID returned from the API
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
        console.error("Failed to add comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handlePutLike = async (post_id: string) => {
    try {
      const response = await fetch("https://pawfinder-api.onrender.com/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: post_id,
        }),
      });

      if (response.ok) {
        // Update the local state to reflect the like
        setPosts((prevPosts) =>
          prevPosts!.map((post) =>
            post.id === post_id
              ? { ...post, likes: post.likes + 1, liked: true }
              : post
          )
        );
      } else {
        console.error("Failed to like post:", response.statusText);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleRemoveLike = async (post_id: string) => {
    try {
      const response = await fetch("https://pawfinder-api.onrender.com/likes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: post_id,
        }),
      });

      if (response.ok) {
        // Update the local state to reflect the removal of the like
        setPosts((prevPosts) =>
          prevPosts!.map((post) =>
            post.id === post_id
              ? { ...post, likes: post.likes - 1, liked: false }
              : post
          )
        );
      } else {
        console.error("Failed to remove like:", response.statusText);
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
      title="Adoptados"
      handleCreatePost={handleCreatePost}
      handleComment={handleComment}
      handlePutLike={handlePutLike}
      handleRemoveLike={handleRemoveLike}
    ></Feed>
  );
}
