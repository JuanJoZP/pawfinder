export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  avatar_url: string
  created_at: Date
}

export interface Category {
  id: number
  name: string
}

export interface Post {
  id: number
  user_id: number
  category_id: number
  caption: string
  image: string
  created_at: Date
}

export interface Comment {
  id: number
  post_id: number
  user_id: number
  content: string
  created_at: Date
}

export interface Like {
  id: number
  post_id: number
  user_id: number
  created_at: Date
}
