import { Card } from "./ui"

export default function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="grid size-11 place-items-center rounded-xl bg-soft text-aqua">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-6 text-xs uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </Card>
  )
}
