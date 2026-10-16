import {
  AlertCircle,
  DollarSign,
  Settings,
  UserPlus,
  Users,
} from "lucide-react"
import { useSearchParams } from "react-router"
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
import useApi from "../hooks/useApi"
import api from "../utils/api"

export default function AdminPage() {
  const [params] = useSearchParams()
  const view = params.get("view") || "dashboard"
  const { data, loading, execute } = useApi("/admin/dashboard/")
  const { data: categoryData, execute: refreshCategories } =
    useApi("/categories/")
  if (loading)
    return (
      <DashboardShell role="admin">
        <Spinner />
      </DashboardShell>
    )
  const patchUser = async (id, is_active) => {
    await api.patch(`/admin/users/${id}/`, { is_active })
    execute()
  }
  const resolve = async (id) => {
    await api.patch(`/disputes/${id}/`, {
      status: "resolved",
      resolution: "Resolved by marketplace administrator.",
    })
    execute()
  }
  return (
    <DashboardShell role="admin">
      <header className="border-b border-line bg-surface px-8 py-6">
        <p className="eyebrow">Admin portal</p>
        <h1 className="mt-1 font-display text-2xl font-bold">
          Marketplace control center
        </h1>
      </header>
      <div className="p-6 sm:p-10">
        {view === "dashboard" && (
          <>
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">Platform pulse</p>
                <h2 className="section-title mt-2">Dashboard</h2>
              </div>
              <Badge tone="success">All systems operational</Badge>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total revenue"
                value={`$${data?.stats?.revenue || 0}`}
                icon={DollarSign}
              />
              <StatCard
                label="Active users"
                value={data?.stats?.users || 0}
                icon={Users}
              />
              <StatCard
                label="Open disputes"
                value={data?.stats?.disputes || 0}
                icon={AlertCircle}
              />
              <StatCard
                label="New today"
                value={data?.stats?.new_today || 0}
                icon={UserPlus}
              />
            </div>
            <Card className="mt-6 p-7">
              <h3 className="font-display text-xl font-bold">
                Recent activity
              </h3>
              <div className="mt-5 space-y-4">
                {(data?.activity || []).map((item) => (
                  <div className="flex gap-3" key={item.id}>
                    <div className="grid size-9 place-items-center rounded-full bg-sand text-sm">
                      {item.actor_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-muted">{item.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
        {view === "users" && (
          <AdminTable
            title="Users"
            headers={["User", "Role", "Joined", "Status", "Action"]}
            rows={(data?.users || []).map((item) => [
              item.full_name || item.username,
              item.role,
              new Date(item.date_joined).toLocaleDateString(),
              <Badge tone={item.is_active ? "success" : "danger"}>
                {item.is_active ? "Active" : "Banned"}
              </Badge>,
              <Button
                variant={item.is_active ? "danger" : "secondary"}
                onClick={() => patchUser(item.id, !item.is_active)}
              >
                {item.is_active ? "Ban" : "Unban"}
              </Button>,
            ])}
          />
        )}
        {view === "categories" && (
          <Card className="p-7">
            <h2 className="font-display text-2xl font-bold">Categories</h2>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={async (event) => {
                event.preventDefault()
                const payload = Object.fromEntries(
                  new FormData(event.currentTarget),
                )
                await api.post("/categories/", payload)
                event.currentTarget.reset()
                refreshCategories()
              }}
            >
              <Input name="name" required placeholder="Category name" />
              <Input name="slug" required placeholder="category-slug" />
              <Button>Add category</Button>
            </form>
            <div className="mt-7 divide-y divide-line">
              {(categoryData?.results || categoryData || []).map((category) => (
                <div
                  className="flex items-center justify-between py-4"
                  key={category.id}
                >
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-xs text-muted">/{category.slug}</p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await api.delete(`/categories/${category.id}/`)
                      refreshCategories()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
        {view === "disputes" && (
          <AdminTable
            title="Dispute resolution"
            headers={["Order", "Opened by", "Reason", "Status", "Action"]}
            rows={(data?.disputes || []).map((item) => [
              `#${item.order}`,
              item.opened_by_name,
              item.reason,
              <Badge tone={item.status === "resolved" ? "success" : "warning"}>
                {item.status}
              </Badge>,
              item.status !== "resolved" && (
                <Button onClick={() => resolve(item.id)}>Resolve</Button>
              ),
            ])}
          />
        )}
        {view === "settings" && (
          <Card className="max-w-xl p-7">
            <div className="flex items-center gap-3">
              <Settings className="text-copper" />
              <h2 className="font-display text-2xl font-bold">
                Platform settings
              </h2>
            </div>
            <form
              className="mt-7 space-y-5"
              onSubmit={async (event) => {
                event.preventDefault()
                const values = Object.fromEntries(
                  new FormData(event.currentTarget),
                )
                values.maintenance_mode = Boolean(values.maintenance_mode)
                await api.patch("/admin/settings/", values)
                execute()
              }}
            >
              <label className="block text-sm font-semibold">
                Commission fee (%)
                <Input
                  className="mt-2"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  name="commission_fee"
                  defaultValue={data?.settings?.commission_fee}
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  defaultChecked={data?.settings?.maintenance_mode}
                />
                Maintenance mode
              </label>
              <Button>Save settings</Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

function AdminTable({ title, headers, rows }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-soft">
              <tr>
                {headers.map((header) => (
                  <th className="p-4" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((cells, index) => (
                <tr className="border-t border-line" key={index}>
                  {cells.map((cell, cellIndex) => (
                    <td className="p-4" key={cellIndex}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState />
        </div>
      )}
    </Card>
  )
}
