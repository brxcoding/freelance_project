import { LoaderCircle } from "lucide-react"

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const variants = {
    primary: "bg-copper text-white hover:bg-copper-dark",
    secondary: "bg-aqua text-white hover:bg-aqua-light",
    outline: "border border-line bg-surface text-ink hover:border-copper",
    ghost: "text-muted hover:bg-soft",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }
  return (
    <button className={`btn ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Input({ icon: Icon, className = "", ...props }) {
  return (
    <label className={`input-shell ${className}`}>
      {Icon && <Icon size={18} />}
      <input
        className="w-full bg-transparent outline-none placeholder:text-muted/70"
        {...props}
      />
    </label>
  )
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-card ${className}`}
    >
      {children}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="grid min-h-40 place-items-center text-aqua">
      <LoaderCircle className="animate-spin" />
    </div>
  )
}

export function EmptyState({
  title = "Nothing here yet",
  body = "New activity will appear here.",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  )
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-soft text-muted",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
