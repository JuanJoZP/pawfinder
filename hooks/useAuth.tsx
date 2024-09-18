import React, { createContext, useContext, useState, useEffect } from "react"
import { useSQLiteContext } from "expo-sqlite"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const db = useSQLiteContext()

  const login = async (email: string, password: string) => {
    const statement = db.prepareSync(
      "SELECT 1 FROM users WHERE email=$email AND password_hash=$password"
    )
    try {
      let result = statement.executeSync<{ "1": number }>({
        $email: email,
        $password: password,
      })
      if (!result.getFirstSync()) {
        throw new Error("Inicio de sesión fallido. Revise sus credenciales")
      }

      setIsAuthenticated(true)
    } catch (error) {
      throw error
    } finally {
      statement.finalizeSync()
    }
  }

  const logout = async () => {
    try {
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      const insertStatement = db.prepareSync(
        "INSERT INTO users (email, password_hash, username, avatar_url) VALUES ($email, $password, $username, $avatar_url)"
      )

      const result = insertStatement.executeSync({
        $email: email,
        $password: password, // en una aplicacion real se deberia hashear
        $username: username,
        $avatar_url: `https://picsum.photos/${Math.floor(Math.random() * 1000)}`, // Random avatar
      })

      insertStatement.finalizeSync()

      if (result.changes && result.changes > 0) {
        setIsAuthenticated(true)
      } else {
        throw new Error("No se pudo crear el usuario")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
