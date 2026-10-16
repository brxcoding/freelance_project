import {
  Bell,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react"
import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { useTheme } from "../context/ThemeContext"
import Brand from "./Brand"
import { Button, Input } from "./ui"

export default function Navbar() {
  const [menu, setMenu] = useState(false)
  const { user, logout } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const { items, unread, open, setOpen } = useNotifications()
  const navigate = useNavigate()
  const submitSearch = (event) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get("q")
    navigate(`/explore?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="page-container flex h-18 items-center gap-7">
        <Brand />
        <form
          className="hidden max-w-md flex-1 lg:block"
          onSubmit={submitSearch}
        >
          <Input
            name="q"
            icon={Search}
            placeholder="What service are you looking for?"
          />
        </form>
        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {["Explore", "About", "Contact"].map((item) => (
            <NavLink
              key={item}
              className="nav-link"
              to={`/${item.toLowerCase()}`}
            >
              {item}
            </NavLink>
          ))}
          {user && (
            <NavLink className="nav-link" to={`/dashboard/${user.role}`}>
              Dashboard
            </NavLink>
          )}
        </nav>
        <div className="relative ml-auto flex items-center gap-1 md:ml-0">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          {user && (
            <>
              <Link className="icon-btn" to="/messages" aria-label="Messages">
                <MessageCircle size={20} />
              </Link>
              <button
                className="icon-btn relative"
                onClick={() => setOpen(!open)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unread > 0 && (
                  <span className="notification-dot">{unread}</span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 top-12 w-80 rounded-xl border border-line bg-surface p-2 shadow-xl">
                  {items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-line p-3 last:border-0"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted">{item.body}</p>
                    </div>
                  ))}
                  {!items.length && (
                    <p className="p-4 text-sm text-muted">
                      You are all caught up.
                    </p>
                  )}
                </div>
              )}
              <button
                className="icon-btn"
                onClick={logout}
                aria-label="Log out"
              >
                <LogOut size={19} />
              </button>
            </>
          )}
          {!user && (
            <>
              <Link className="hidden sm:block" to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link className="hidden sm:block" to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
          <button className="icon-btn md:hidden" onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menu && (
        <div className="border-t border-line bg-surface p-4 md:hidden">
          {["Explore", "About", "Contact"].map((item) => (
            <Link
              onClick={() => setMenu(false)}
              className="block p-3 font-medium"
              key={item}
              to={`/${item.toLowerCase()}`}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
