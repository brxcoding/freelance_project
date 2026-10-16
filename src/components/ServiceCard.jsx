import { Heart, Star } from "lucide-react"
import { Link } from "react-router"
import { Card } from "./ui"

export default function ServiceCard({ service }) {
  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        {service.image && (
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={service.image}
            alt=""
          />
        )}
        <button className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-aqua">
          <Heart size={17} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-sand font-semibold text-copper-dark">
            {service.freelancer?.full_name?.[0] || "F"}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {service.freelancer?.full_name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              {service.category?.name}
            </p>
          </div>
        </div>
        <Link
          to={`/services/${service.id}`}
          className="mt-4 block min-h-12 font-display text-lg font-semibold leading-snug hover:text-copper"
        >
          {service.title}
        </Link>
        <div className="mt-4 flex items-center gap-1 text-sm">
          <Star className="fill-copper text-copper" size={16} />
          <strong>{service.rating || "New"}</strong>
          <span className="text-muted">({service.review_count || 0})</span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <span className="text-[10px] uppercase tracking-wider text-muted">
            Starting at
          </span>
          <strong className="text-xl">${service.price}</strong>
        </div>
      </div>
    </Card>
  )
}
