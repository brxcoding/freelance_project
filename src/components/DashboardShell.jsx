import {
  LayoutDashboard,
  Layers3,
  ListChecks,
  MessageCircle,
  Settings,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react"
import { NavLink } from "react-router"
import Brand from "./Brand"

export default function DashboardShell({ role, children }) {
  const links =
    role === "admin"
      ? [
          ["Dashboard", "/admin", LayoutDashboard],
          ["Users", "/admin?view=users", Users],
          ["Categories", "/admin?view=categories", Layers3],
          ["Disputes", "/admin?view=disputes", ListChecks],
          ["Chat", "/messages", MessageCircle],
          ["Settings", "/admin?view=settings", Settings],
        ]
      : [
          ["Overview", `/dashboard/${role}`, LayoutDashboard],
          [
            role === "freelancer" ? "My services" : "My orders",
            `/dashboard/${role}?view=work`,
            ShoppingBag,
          ],
          ["Orders", `/dashboard/${role}?view=orders`, ListChecks],
          ["Messages", "/messages", MessageCircle],
          [
            role === "freelancer" ? "Earnings" : "Spending",
            `/dashboard/${role}?view=finance`,
            WalletCards,
          ],
          ["Settings", `/dashboard/${role}?view=settings`, Settings],
        ]
  return (
    <div className="min-h-screen bg-soft lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-aqua p-6 text-white lg:min-h-screen">
        <Brand inverse />
        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-sand">
          {role} portal
        </p>
        <nav className="mt-4 space-y-1">
          {links.map(([label, href, Icon]) => (
            <NavLink
              key={label}
              to={href}
              end={label === "Dashboard" || label === "Overview"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                  isActive
                    ? "bg-copper text-white"
                    : "text-white/75 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  )
}
