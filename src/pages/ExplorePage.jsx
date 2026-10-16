import { Search, SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "react-router"
import ServiceCard from "../components/ServiceCard"
import { Button, EmptyState, Input, Spinner } from "../components/ui"
import useApi from "../hooks/useApi"

export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const query = Object.fromEntries(params.entries())
  const { data, loading, error } = useApi("/services/", { params: query })
  const { data: categories } = useApi("/categories/")
  const services = data?.results || data || []
  const update = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }
  return (
    <>
      <section className="border-b border-line bg-surface py-16">
        <div className="page-container max-w-5xl">
          <p className="eyebrow">Find your next collaborator</p>
          <h1 className="mt-3 font-display text-5xl font-bold">
            Bring the right work to life.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Browse trusted independent talent for the details, ideas, and
            momentum your business needs next.
          </p>
          <form
            className="mt-8 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              update("search", new FormData(event.currentTarget).get("search"))
            }}
          >
            <Input
              className="flex-1"
              icon={Search}
              name="search"
              defaultValue={query.search}
              placeholder="Try brand identity or SEO strategy"
            />
            <Button>Search</Button>
          </form>
        </div>
      </section>
      <section className="page-container grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <SlidersHorizontal size={18} />
            Refine results
          </div>
          <button
            className="mt-2 text-sm text-copper"
            onClick={() => setParams({})}
          >
            Clear all
          </button>
          <label className="mt-8 block text-sm font-semibold">
            Category
            <select
              className="mt-2 min-h-12 w-full rounded-lg border border-line bg-surface px-3"
              value={query.category || ""}
              onChange={(event) => update("category", event.target.value)}
            >
              <option value="">All categories</option>
              {(categories?.results || categories || []).map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-6 block text-sm font-semibold">
            Maximum price
            <input
              className="mt-4 w-full accent-copper"
              type="range"
              min="25"
              max="1000"
              step="25"
              value={query.max_price || 1000}
              onChange={(event) => update("max_price", event.target.value)}
            />
            <span className="mt-2 flex justify-between text-xs text-muted">
              <span>$25</span>
              <span>${query.max_price || "1000"}+</span>
            </span>
          </label>
          <label className="mt-6 block text-sm font-semibold">
            Delivery time
            <select
              className="mt-2 min-h-12 w-full rounded-lg border border-line bg-surface px-3"
              value={query.delivery_days || ""}
              onChange={(event) => update("delivery_days", event.target.value)}
            >
              <option value="">Any delivery time</option>
              <option value="3">Up to 3 days</option>
              <option value="7">Up to 7 days</option>
              <option value="14">Up to 14 days</option>
            </select>
          </label>
        </aside>
        <div>
          <div className="mb-6 flex justify-between text-sm">
            <strong>{data?.count ?? services.length} services found</strong>
            <span className="text-muted">Curated for quality and fit</span>
          </div>
          {loading ? (
            <Spinner />
          ) : error ? (
            <EmptyState title="Marketplace unavailable" body={error} />
          ) : services.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching services"
              body="Try widening your search or clearing a filter."
            />
          )}
        </div>
      </section>
    </>
  )
}
