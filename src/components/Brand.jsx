import { Link } from "react-router"

export default function Brand({ inverse = false }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 font-display text-xl font-bold tracking-tight ${
        inverse ? "text-white" : "text-ink"
      }`}
    >
      <span
        className={`grid size-9 place-items-center rounded-lg ${
          inverse ? "bg-white text-aqua" : "bg-aqua text-white"
        }`}
      >
        M
      </span>
      <span>
        Freelance<span className="text-copper">MKT</span>
      </span>
    </Link>
  )
}
