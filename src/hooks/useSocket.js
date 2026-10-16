import { useEffect, useRef } from "react"

export default function useSocket(path, onMessage) {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token || !path) return undefined
    const base = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws"
    const socket = new WebSocket(`${base}/${path}/?token=${token}`)
    socketRef.current = socket
    socket.onmessage = (event) => onMessage?.(JSON.parse(event.data))
    return () => socket.close()
  }, [path, onMessage])

  return socketRef
}
