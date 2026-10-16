import { CheckCheck, File, Paperclip, Search, Send, Trash2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { Button, EmptyState, Input, Spinner } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import useApi from "../hooks/useApi"
import useSocket from "../hooks/useSocket"
import uploadToCloudinary from "../utils/uploadToCloudinary"
import api from "../utils/api"

export default function MessagesPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const { data, loading } = useApi("/conversations/")
  const conversations = data?.results || data || []
  const activeId = params.get("conversation") || conversations[0]?.id
  const active = conversations.find(
    (item) => String(item.id) === String(activeId),
  )
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const fileRef = useRef()
  useEffect(() => {
    if (activeId)
      api
        .get(`/conversations/${activeId}/messages/`)
        .then(({ data: history }) => setMessages(history.results || history))
  }, [activeId])
  const incoming = useCallback(
    (payload) => {
      if (payload.type === "typing")
        return setTyping(payload.user_id !== user?.id && payload.is_typing)
      if (payload.type === "message")
        setMessages((current) => [...current, payload.message])
      if (payload.type === "cleared") setMessages([])
    },
    [user?.id],
  )
  const socket = useSocket(activeId ? `chat/${activeId}` : null, incoming)
  const send = async (event) => {
    event.preventDefault()
    const input = event.currentTarget.elements.message
    let attachment = ""
    if (fileRef.current.files[0])
      attachment = await uploadToCloudinary(fileRef.current.files[0])
    if (!input.value.trim() && !attachment) return
    socket.current?.send(
      JSON.stringify({ type: "message", body: input.value.trim(), attachment }),
    )
    input.value = ""
    fileRef.current.value = ""
  }
  if (loading) return <Spinner />
  return (
    <div className="h-[calc(100vh-4.5rem)] bg-surface">
      <div className="grid h-full md:grid-cols-[320px_1fr]">
        <aside className="border-r border-line">
          <div className="p-4">
            <Input icon={Search} placeholder="Search contacts" />
          </div>
          {conversations.map((conversation) => {
            const peer = conversation.participants.find(
              (person) => person.id !== user?.id,
            )
            return (
              <button
                onClick={() => setParams({ conversation: conversation.id })}
                key={conversation.id}
                className={`flex w-full items-center gap-3 border-t border-line p-4 text-left ${
                  String(activeId) === String(conversation.id)
                    ? "bg-aqua text-white"
                    : "hover:bg-soft"
                }`}
              >
                <div className="relative grid size-11 place-items-center rounded-full bg-sand text-aqua">
                  {peer?.full_name?.[0] || peer?.username?.[0]}
                  {peer?.is_online && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {peer?.full_name || peer?.username}
                  </p>
                  <p className="truncate text-xs opacity-70">
                    {conversation.last_message?.body || "Start a conversation"}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="rounded-full bg-copper px-2 py-0.5 text-xs text-white">
                    {conversation.unread_count}
                  </span>
                )}
              </button>
            )
          })}
        </aside>
        <section className="flex min-w-0 flex-col bg-canvas">
          {active ? (
            <>
              <header className="flex h-18 items-center justify-between border-b border-line bg-surface px-6">
                <div>
                  <h1 className="font-display text-lg font-bold">
                    {
                      active.participants.find(
                        (person) => person.id !== user?.id,
                      )?.full_name
                    }
                  </h1>
                  <p className="text-xs text-emerald-600">
                    {active.participants.find(
                      (person) => person.id !== user?.id,
                    )?.is_online
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.confirm("Clear this conversation for everyone?") &&
                    socket.current?.send(JSON.stringify({ type: "clear" }))
                  }
                  className="icon-btn text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </header>
              <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                        message.sender.id === user?.id
                          ? "bg-copper text-white"
                          : "border border-line bg-surface"
                      }`}
                    >
                      {message.body && <p>{message.body}</p>}
                      {message.attachment && (
                        <a
                          className="mt-2 flex items-center gap-2 text-sm underline"
                          href={message.attachment}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <File size={16} />
                          Download attachment
                        </a>
                      )}
                      <p className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.sender.id === user?.id && (
                          <CheckCheck size={13} />
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {typing && <p className="text-xs text-muted">Typing…</p>}
              </div>
              <form
                onSubmit={send}
                className="border-t border-line bg-surface p-4"
              >
                <div className="flex items-center gap-2 rounded-xl bg-soft p-2">
                  <input
                    ref={fileRef}
                    className="hidden"
                    type="file"
                    id="attachment"
                  />
                  <label htmlFor="attachment" className="icon-btn">
                    <Paperclip size={19} />
                  </label>
                  <input
                    name="message"
                    onInput={() =>
                      socket.current?.send(
                        JSON.stringify({ type: "typing", is_typing: true }),
                      )
                    }
                    className="min-h-11 flex-1 bg-transparent px-2 outline-none"
                    placeholder="Type a message..."
                  />
                  <Button className="!px-4">
                    <Send size={17} />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </form>
            </>
          ) : (
            <div className="grid h-full place-items-center">
              <EmptyState
                title="Select a conversation"
                body="Choose a contact to view message history."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
