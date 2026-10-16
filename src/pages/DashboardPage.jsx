import { DollarSign, PackageCheck, Plus, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useParams, useSearchParams } from "react-router"
import DashboardShell from "../components/DashboardShell"
import StatCard from "../components/StatCard"
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Spinner,
} from "../components/ui"
import { useAuth } from "../context/AuthContext"
import useApi from "../hooks/useApi"
import api from "../utils/api"
import uploadToCloudinary from "../utils/uploadToCloudinary"

const tones = {
  pending: "warning",
  paid: "info",
  in_progress: "info",
  delivered: "success",
  completed: "success",
  cancelled: "danger",
  disputed: "danger",
}

export default function DashboardPage() {
  const { role } = useParams()
  const [params] = useSearchParams()
  const view = params.get("view") || "overview"
  const { user, setUser } = useAuth()
  const { data, loading, execute } = useApi(`/dashboard/${role}/`)
  const [editing, setEditing] = useState(false)
  if (loading)
    return (
      <DashboardShell role={role}>
        <Spinner />
      </DashboardShell>
    )
  const stats = data?.stats || {}
  const orders = data?.orders || []
  const services = data?.services || []
  const chart = data?.chart || []
  const saveProfile = async (event) => {
    event.preventDefault()
    const { data: profile } = await api.patch(
      "/auth/me/",
      Object.fromEntries(new FormData(event.currentTarget)),
    )
    setUser(profile)
  }
  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return
    await api.delete(`/services/${id}/`)
    execute()
  }
  const createService = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form))
    const file = form.elements.image_file.files[0]
    if (file) payload.image = await uploadToCloudinary(file)
    delete payload.image_file
    payload.category_id = payload.category
    delete payload.category
    payload.features = payload.features.split("\n").filter(Boolean)
    await api.post("/services/", payload)
    form.reset()
    setEditing(false)
    execute()
  }
  return (
    <DashboardShell role={role}>
      <header className="border-b border-line bg-surface px-6 py-6 sm:px-10">
        <p className="eyebrow">{role} portal</p>
        <h1 className="mt-1 font-display text-2xl font-bold">
          Good morning, {user?.full_name?.split(" ")[0] || user?.username}.
        </h1>
      </header>
      <div className="p-6 sm:p-10">
        {view === "overview" && (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <StatCard
                label={
                  role === "freelancer" ? "Total earnings" : "Total spending"
                }
                value={`$${stats.total_amount || 0}`}
                icon={DollarSign}
                trend={stats.amount_trend}
              />
              <StatCard
                label="Active orders"
                value={stats.active_orders || 0}
                icon={PackageCheck}
                trend={stats.order_trend}
              />
              <StatCard
                label={
                  role === "freelancer" ? "Average rating" : "Completed orders"
                }
                value={
                  role === "freelancer"
                    ? stats.average_rating || "—"
                    : stats.completed_orders || 0
                }
                icon={Star}
              />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <Card className="p-7">
                <h2 className="font-display text-xl font-bold">
                  {role === "freelancer" ? "Earnings" : "Spending"} overview
                </h2>
                <div className="h-72">
                  {chart.length ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chart}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={3}
                        >
                          {chart.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={
                                ["#30525C", "#C35627", "#DCAA89", "#4C848D"][
                                  index % 4
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </Card>
              <Card className="bg-aqua p-8 text-white">
                <p className="eyebrow !text-sand">Your momentum</p>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  Keep your best work moving.
                </h2>
                <p className="mt-4 leading-7 text-white/70">
                  Review current orders, respond quickly, and keep every project
                  on track.
                </p>
              </Card>
            </div>
          </>
        )}
        {(view === "orders" || (view === "work" && role === "client")) && (
          <OrdersTable orders={orders} refresh={execute} role={role} />
        )}
        {view === "work" && role === "freelancer" && (
          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Your catalog</p>
                <h2 className="section-title mt-2">My services</h2>
              </div>
              <Button onClick={() => setEditing(!editing)}>
                <Plus size={17} />
                Create service
              </Button>
            </div>
            {editing && (
              <Card className="mt-6 p-6">
                <form
                  className="grid gap-4 md:grid-cols-2"
                  onSubmit={createService}
                >
                  <Input name="title" required placeholder="Service title" />
                  <Input name="category" required placeholder="Category ID" />
                  <Input
                    name="price"
                    type="number"
                    min="1"
                    required
                    placeholder="Price"
                  />
                  <Input
                    name="delivery_days"
                    type="number"
                    min="1"
                    required
                    placeholder="Delivery days"
                  />
                  <textarea
                    name="description"
                    required
                    className="min-h-28 rounded-lg border border-line bg-surface p-4 md:col-span-2"
                    placeholder="Describe your service"
                  />
                  <textarea
                    name="features"
                    className="min-h-24 rounded-lg border border-line bg-surface p-4 md:col-span-2"
                    placeholder="One included feature per line"
                  />
                  <input
                    name="image_file"
                    type="file"
                    accept="image/*"
                    className="rounded-lg border border-line bg-surface p-3 md:col-span-2"
                  />
                  <Button className="md:col-span-2">Publish service</Button>
                </form>
              </Card>
            )}
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video bg-soft">
                    {service.image && (
                      <img
                        src={service.image}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{service.title}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <strong>${service.price}</strong>
                      <Button
                        variant="danger"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {!services.length && (
              <EmptyState
                title="Create your first service"
                body="Package your expertise and publish it to the marketplace."
              />
            )}
          </section>
        )}
        {view === "finance" && (
          <Card className="p-7">
            <h2 className="font-display text-2xl font-bold">
              {role === "freelancer" ? "Earnings" : "Spending"}
            </h2>
            <p className="mt-2 text-muted">
              Amounts are calculated from completed Stripe-backed orders.
            </p>
            <div className="mt-8">
              <OrdersTable
                orders={orders.filter((order) =>
                  ["paid", "completed", "delivered"].includes(order.status),
                )}
                refresh={execute}
                role={role}
              />
            </div>
          </Card>
        )}
        {view === "settings" && (
          <Card className="max-w-2xl p-7">
            <h2 className="font-display text-2xl font-bold">
              Account settings
            </h2>
            <form className="mt-7 space-y-5" onSubmit={saveProfile}>
              <label className="block text-sm font-semibold">
                Bio
                <textarea
                  name="bio"
                  defaultValue={user?.bio}
                  className="mt-2 min-h-32 w-full rounded-lg border border-line bg-surface p-4"
                />
              </label>
              {role === "freelancer" ? (
                <label className="block text-sm font-semibold">
                  Stripe account ID
                  <Input
                    className="mt-2"
                    name="stripe_account_id"
                    defaultValue={user?.stripe_account_id}
                    placeholder="acct_..."
                  />
                </label>
              ) : (
                <label className="block text-sm font-semibold">
                  Payment method label
                  <Input
                    className="mt-2"
                    name="payment_method_label"
                    defaultValue={user?.payment_method_label}
                    placeholder="Visa ending in 4242"
                  />
                </label>
              )}
              <Button>Save changes</Button>
            </form>
            <form
              className="mt-9 space-y-4 border-t border-line pt-7"
              onSubmit={async (event) => {
                event.preventDefault()
                await api.post(
                  "/auth/change-password/",
                  Object.fromEntries(new FormData(event.currentTarget)),
                )
                event.currentTarget.reset()
              }}
            >
              <h3 className="font-semibold">Change password</h3>
              <Input
                name="current_password"
                type="password"
                required
                placeholder="Current password"
              />
              <Input
                name="new_password"
                type="password"
                required
                placeholder="New password"
              />
              <Button variant="outline">Update password</Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

function OrdersTable({ orders, refresh, role }) {
  const [selected, setSelected] = useState(null)
  const [action, setAction] = useState("")
  const updateStatus = async (order, status) => {
    await api.patch(`/orders/${order.id}/`, { status })
    refresh()
  }
  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-soft text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Client</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="p-4 font-semibold">
                    #{order.id} · {order.service_title}
                  </td>
                  <td className="p-4">{order.client_name}</td>
                  <td className="p-4">${order.total}</td>
                  <td className="p-4">
                    <Badge tone={tones[order.status]}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelected(order)
                          setAction("detail")
                        }}
                      >
                        View
                      </Button>
                      {role === "freelancer" && (
                        <select
                          className="rounded-md border border-line bg-surface p-2"
                          value={order.status}
                          onChange={(event) =>
                            updateStatus(order, event.target.value)
                          }
                        >
                          {[
                            "pending",
                            "paid",
                            "in_progress",
                            "delivered",
                            "completed",
                            "cancelled",
                            "disputed",
                          ].map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      )}
                      {role === "client" && order.status === "completed" && (
                        <Button
                          onClick={() => {
                            setSelected(order)
                            setAction("review")
                          }}
                        >
                          Review
                        </Button>
                      )}
                      {role === "client" &&
                        !["cancelled", "disputed"].includes(order.status) && (
                          <Button
                            variant="danger"
                            onClick={() => {
                              setSelected(order)
                              setAction("dispute")
                            }}
                          >
                            Dispute
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders.length && (
          <div className="p-6">
            <EmptyState title="No orders yet" />
          </div>
        )}
      </Card>
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-5">
          <Card className="w-full max-w-lg p-7">
            <h3 className="font-display text-2xl font-bold">
              {action === "detail"
                ? `Order #${selected.id}`
                : action === "review"
                  ? "Leave a review"
                  : "Open a dispute"}
            </h3>
            {action === "detail" ? (
              <div className="mt-5 space-y-3 text-sm">
                <p>
                  <strong>Service:</strong> {selected.service_title}
                </p>
                <p>
                  <strong>Total:</strong> ${selected.total}
                </p>
                <p>
                  <strong>Status:</strong> {selected.status.replace("_", " ")}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault()
                  const values = Object.fromEntries(
                    new FormData(event.currentTarget),
                  )
                  if (action === "review")
                    await api.post("/reviews/", {
                      order: selected.id,
                      rating: values.rating,
                      comment: values.comment,
                    })
                  else
                    await api.post("/disputes/", {
                      order: selected.id,
                      reason: values.reason,
                    })
                  setSelected(null)
                  refresh()
                }}
              >
                {action === "review" ? (
                  <>
                    <label className="block text-sm font-semibold">
                      Rating
                      <select
                        name="rating"
                        className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface px-3"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>
                            {value} stars
                          </option>
                        ))}
                      </select>
                    </label>
                    <textarea
                      name="comment"
                      required
                      className="min-h-28 w-full rounded-lg border border-line bg-surface p-4"
                      placeholder="Share your experience"
                    />
                  </>
                ) : (
                  <textarea
                    name="reason"
                    required
                    className="min-h-32 w-full rounded-lg border border-line bg-surface p-4"
                    placeholder="Explain what went wrong"
                  />
                )}
                <Button>Submit</Button>
              </form>
            )}
            <Button
              className="mt-5"
              variant="ghost"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </>
  )
}
