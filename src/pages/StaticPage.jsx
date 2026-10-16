import { Button, Card, Input } from "../components/ui"

export default function StaticPage({ type }) {
  if (type === "contact")
    return (
      <div className="page-container grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-display text-5xl font-bold">
            We&apos;re here to help.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted">
            Questions about an order, your account, or the marketplace? Send our
            team a note.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-5">
            <Input placeholder="Your name" />
            <Input type="email" placeholder="Email address" />
            <textarea
              className="min-h-40 w-full rounded-lg border border-line bg-surface p-4 outline-none"
              placeholder="How can we help?"
            />
            <Button>Send message</Button>
          </form>
        </Card>
      </div>
    )
  return (
    <div className="page-container py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">About FreelanceMKT</p>
        <h1 className="mt-3 font-display text-5xl font-bold">
          Independent talent. Shared ambition.
        </h1>
        <p className="mt-7 text-xl leading-9 text-muted">
          FreelanceMKT brings clients and specialists together around focused
          work. Transparent services, protected payments, direct communication,
          and accountable delivery make every collaboration easier to start and
          simpler to finish.
        </p>
      </div>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {[
          [
            "Clarity first",
            "Service packages and milestones make expectations visible.",
          ],
          [
            "Built for trust",
            "Reviews, secure payments, and dispute support protect both sides.",
          ],
          [
            "Work without friction",
            "Chat, attachments, status updates, and notifications stay connected.",
          ],
        ].map(([title, copy]) => (
          <Card key={title} className="p-7">
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 leading-7 text-muted">{copy}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
