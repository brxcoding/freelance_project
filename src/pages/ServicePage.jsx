import { Check, Heart, MessageCircle, ShieldCheck, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { Badge, Button, Card, EmptyState, Spinner } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import useApi from "../hooks/useApi"
import api from "../utils/api"

export default function ServicePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: service, loading, error } = useApi(`/services/${id}/`)
  if (loading) return <Spinner />
  if (error || !service)
    return (
      <div className="page-container py-20">
        <EmptyState title="Service not found" body={error} />
      </div>
    )
  const order = async () => {
    if (!user) return navigate("/login")
    const { data } = await api.post("/orders/", {
      service: service.id,
      quantity: 1,
    })
    const checkout = await api.post(`/orders/${data.id}/checkout/`)
    if (checkout.data.url) window.location.href = checkout.data.url
  }
  const message = async () => {
    if (!user) return navigate("/login")
    const { data } = await api.post("/conversations/", {
      participant_id: service.freelancer.id,
    })
    navigate(`/messages?conversation=${data.id}`)
  }
  return (
    <div className="page-container py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-soft">
            {service.image && (
              <img
                className="h-full w-full object-cover"
                src={service.image}
                alt={service.title}
              />
            )}
          </div>
          <p className="eyebrow mt-8">{service.category?.name}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-4xl font-bold">{service.title}</h1>
            <button className="icon-btn border border-line">
              <Heart />
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="grid size-10 place-items-center rounded-full bg-sand">
              {service.freelancer?.full_name?.[0]}
            </div>
            <strong>{service.freelancer?.full_name}</strong>
            <Badge tone="success">Available</Badge>
            <span className="flex items-center gap-1">
              <Star className="fill-copper text-copper" size={16} />
              {service.rating || "New"} ({service.review_count || 0})
            </span>
          </div>
          <div className="mt-9 border-t border-line pt-8">
            <h2 className="font-display text-2xl font-bold">
              About this service
            </h2>
            <p className="mt-4 whitespace-pre-line leading-8 text-muted">
              {service.description}
            </p>
          </div>
        </div>
        <Card className="h-fit p-7 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-muted">Starting at</p>
              <p className="font-display text-3xl font-bold">
                ${service.price}
              </p>
            </div>
            <Badge tone="warning">{service.delivery_days} day delivery</Badge>
          </div>
          <div className="my-6 border-t border-line" />
          <p className="font-semibold">What&apos;s included</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {(service.features || []).map((feature) => (
              <li className="flex gap-2" key={feature}>
                <Check size={17} className="text-copper" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="mt-7 w-full" onClick={order}>
            Order now · ${service.price}
          </Button>
          <Button className="mt-3 w-full" variant="outline" onClick={message}>
            <MessageCircle size={17} /> Message freelancer
          </Button>
          <div className="mt-6 flex justify-center gap-2 text-xs text-muted">
            <ShieldCheck size={16} />
            Secure payment and support
          </div>
        </Card>
      </div>
    </div>
  )
}
