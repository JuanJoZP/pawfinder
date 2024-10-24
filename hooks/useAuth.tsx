import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("https://pawfinder-api.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Inicio de sesión fallido. Revise sus credenciales"
        );
      }

      const data = await response.json();
      const userId = data.userId; // Adjust this based on your API response structure
      setUserId(userId);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
  ) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const avatarUrl = `https://picsum.photos/${Math.floor(
        Math.random() * 1000
      )}`; // Random avatar

      const response = await fetch(
        "https://pawfinder-api.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password, // In a real application, you should hash this
            username: username,
            avatar_url: avatarUrl,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No se pudo crear el usuario");
      }

      const data = await response.json();
      // Assuming the API returns the user ID in the response
      const userId = data.userId; // Adjust this based on your API response structure
      setUserId(userId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
