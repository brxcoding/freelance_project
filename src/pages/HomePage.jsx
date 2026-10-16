import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router"
import ServiceCard from "../components/ServiceCard"
import { Button, EmptyState, Spinner } from "../components/ui"
import useApi from "../hooks/useApi"

export default function HomePage() {
  const navigate = useNavigate()
  const { data, loading } = useApi("/services/", {
    params: { featured: true, page_size: 6 },
  })
  const services = data?.results || data || []
  const submit = (event) => {
    event.preventDefault()
    navigate(
      `/explore?search=${encodeURIComponent(new FormData(event.currentTarget).get("search"))}`,
    )
  }
  return (
    <>
      <section className="overflow-hidden bg-aqua text-white">
        <div className="page-container relative py-20 sm:py-28">
          <div className="absolute -right-24 top-[-30%] size-[34rem] rounded-full bg-aqua-light/35 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="eyebrow !text-sand">
              <Sparkles className="mr-2 inline" size={15} />
              Curated talent, real results
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-7xl">
              Find world-class{" "}
              <span className="text-sand">freelance services.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              Move important work forward with trusted specialists, clear
              milestones, and protected payments.
            </p>
            <form
              onSubmit={submit}
              className="mt-9 flex max-w-2xl flex-col gap-2 rounded-xl bg-white p-2 sm:flex-row"
            >
              <label className="flex flex-1 items-center gap-3 px-4 text-aqua">
                <Search size={20} />
                <input
                  name="search"
                  className="min-h-11 w-full bg-transparent outline-none"
                  placeholder="What service are you looking for?"
                />
              </label>
              <Button type="submit">
                Search services <ArrowRight size={17} />
              </Button>
            </form>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
              <span>
                <strong className="text-white">10K+</strong> services
              </span>
              <span>
                <strong className="text-white">5K+</strong> freelancers
              </span>
              <span>
                <strong className="text-white">98%</strong> satisfaction
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="page-container py-20">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">A little inspiration</p>
            <h2 className="section-title mt-2">Popular services</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate("/explore")}>
            See all <ArrowRight size={16} />
          </Button>
        </div>
        <div className="mt-9">
          {loading ? (
            <Spinner />
          ) : services.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Services are being curated"
              body="Create a freelancer account to publish the first service."
            />
          )}
        </div>
      </section>
      <section className="bg-soft py-20">
        <div className="page-container">
          <div className="text-center">
            <p className="eyebrow">Work with confidence</p>
            <h2 className="section-title mt-2">
              Everything you need to move faster
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "Verified specialists",
                "Review profiles, portfolios, ratings, and proven work.",
                Users,
              ],
              [
                "Secure payments",
                "Stripe-powered checkout keeps every transaction protected.",
                ShieldCheck,
              ],
              [
                "Clear collaboration",
                "Real-time chat, files, milestones, and notifications in one place.",
                CheckCircle2,
              ],
            ].map(([title, body, Icon]) => (
              <div
                key={title}
                className="rounded-2xl bg-surface p-8 shadow-card"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-sand/30 text-copper">
                  <Icon />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-container py-20">
        <div className="rounded-3xl bg-copper px-8 py-14 text-white sm:px-14">
          <p className="eyebrow !text-white/70">Your next move</p>
          <div className="mt-3 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-4xl font-bold">
              The right collaborator can change the shape of a business.
            </h2>
            <Button
              className="bg-white !text-copper hover:bg-white/90"
              onClick={() => navigate("/signup")}
            >
              Join FreelanceMKT <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
