"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { api, getStoredUser, removeToken, setStoredUser, setToken } from "@/lib/api"

export type Role = "USER" | "ADMIN" | "STAFF"

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: Role
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  role: Role | null
  isLoading: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("mongkolka_token") : null

    if (storedToken && storedUser) {
      setUser(storedUser)
      setTokenState(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken)
    setStoredUser(newUser)
    setTokenState(newToken)
    setUser(newUser)
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me")
      if (res?.data) {
        setUser(res.data)
        setStoredUser(res.data)
      }
    } catch (e) {
      console.error("Failed to refresh user session", e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// Compatibility helper mimicking next-auth's useSession
export function useSession() {
  const { user, isLoading } = useAuth()
  return {
    data: user ? { user } : null,
    status: isLoading ? "loading" : user ? "authenticated" : "unauthenticated",
  }
}
