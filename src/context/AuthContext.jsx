import { createContext, useContext, useEffect, useMemo, useState } from "react"
import api from "../utils/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("accessToken")),
  )

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return
    api
      .get("/auth/me/")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post("/auth/token/", credentials)
    localStorage.setItem("accessToken", data.access)
    localStorage.setItem("refreshToken", data.refresh)
    const profile = await api.get("/auth/me/")
    setUser(profile.data)
    return profile.data
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, setUser, loading, login, logout }),
    [user, loading],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
