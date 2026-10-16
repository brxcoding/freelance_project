import { BriefcaseBusiness, Check, UserRound } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Brand from "../components/Brand"
import { Button, Card, Input } from "../components/ui"
import api from "../utils/api"
import uploadToCloudinary from "../utils/uploadToCloudinary"

export default function SignupPage() {
  const [role, setRole] = useState("client")
  const [avatar, setAvatar] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      await api.post("/auth/register/", {
        ...Object.fromEntries(new FormData(event.currentTarget)),
        role,
        avatar,
      })
      navigate("/login")
    } catch (error) {
      setMessage(
        Object.values(error.response?.data || {})
          .flat()
          .join(" ") || "Registration failed.",
      )
    } finally {
      setLoading(false)
    }
  }
  const upload = async (event) => {
    if (!event.target.files[0]) return
    setLoading(true)
    try {
      setAvatar(await uploadToCloudinary(event.target.files[0]))
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-canvas">
      <div className="p-6">
        <Brand />
      </div>
      <main className="page-container grid gap-14 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <section className="pt-8">
          <p className="eyebrow">Join the marketplace</p>
          <h1 className="mt-5 max-w-md font-display text-5xl font-bold">
            Make your next move count.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted">
            One account connects you with people, projects, and possibilities
            that move work forward.
          </p>
          <div className="mt-9 space-y-5 text-muted">
            {[
              "Meet a professional community built around good work.",
              "Keep projects, payments, and conversations in one place.",
            ].map((text) => (
              <p className="flex gap-3" key={text}>
                <Check className="mt-0.5 text-copper" size={20} />
                {text}
              </p>
            ))}
          </div>
        </section>
        <Card className="p-7 sm:p-10">
          <h2 className="font-display text-2xl font-bold">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-muted">
            Start with the essentials. You can complete your profile anytime.
          </p>
          <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
            <label className="text-sm font-semibold">
              Full name
              <Input
                className="mt-2"
                name="full_name"
                required
                placeholder="Jordan Davis"
              />
            </label>
            <label className="text-sm font-semibold">
              Username
              <Input
                className="mt-2"
                name="username"
                required
                placeholder="jordandavis"
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Email address
              <Input
                className="mt-2"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Password
              <Input
                className="mt-2"
                name="password"
                type="password"
                minLength="8"
                required
                placeholder="Create a secure password"
              />
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="mb-3 text-sm font-semibold">
                How will you use FreelanceMKT?
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "client",
                    "I want to hire",
                    "Find trusted talent for your next project.",
                    UserRound,
                  ],
                  [
                    "freelancer",
                    "I want to work",
                    "Showcase your skills and grow your business.",
                    BriefcaseBusiness,
                  ],
                ].map(([value, title, copy, Icon]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRole(value)}
                    className={`rounded-xl border p-4 text-left ${
                      role === value
                        ? "border-copper bg-copper/5"
                        : "border-line"
                    }`}
                  >
                    <Icon size={20} className="text-copper" />
                    <strong className="mt-2 block">{title}</strong>
                    <span className="text-xs text-muted">{copy}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="text-sm font-semibold sm:col-span-2">
              Avatar (optional)
              <input
                className="mt-2 block w-full rounded-lg border border-line bg-surface p-3 text-sm"
                type="file"
                accept="image/*"
                onChange={upload}
              />
            </label>
            {message && (
              <p className="text-sm text-red-600 sm:col-span-2">{message}</p>
            )}
            <Button className="sm:col-span-2" disabled={loading}>
              {loading ? "Please wait..." : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Already registered?{" "}
            <Link to="/login" className="font-semibold underline">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
