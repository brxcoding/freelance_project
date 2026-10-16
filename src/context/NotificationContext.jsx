import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import useApi from "../hooks/useApi"
import useSocket from "../hooks/useSocket"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const { data, setData, execute } = useApi("/notifications/", {
    immediate: Boolean(user),
  })
  const [open, setOpen] = useState(false)
  const onMessage = useCallback(
    (notice) => {
      setData((current) => [notice, ...(current?.results || current || [])])
    },
    [setData],
  )
  useSocket(user ? "notifications" : null, onMessage)
  const items = data?.results || data || []
  const unread = items.filter((item) => !item.read).length
  const value = useMemo(
    () => ({ items, unread, open, setOpen, refresh: execute }),
    [items, unread, open, execute],
  )
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
