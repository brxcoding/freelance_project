import { ArrowRight, LockKeyhole, User } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Brand from "../components/Brand"
import { Button, Card, Input } from "../components/ui"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const user = await login(
        Object.fromEntries(new FormData(event.currentTarget)),
      )
      navigate(user.role === "admin" ? "/admin" : `/dashboard/${user.role}`)
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Check your username and password.",
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-canvas">
      <div className="p-6">
        <Brand />
      </div>
      <main className="mx-auto flex max-w-md flex-col items-center px-5 py-14">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-3 text-center font-display text-4xl font-bold">
          Sign in to FreelanceMKT
        </h1>
        <p className="mt-2 text-center text-muted">
          Pick up where you left off and keep your next great project moving.
        </p>
        <Card className="mt-8 w-full p-8">
          <form className="space-y-5" onSubmit={submit}>
            <label className="block text-sm font-semibold">
              Username
              <Input
                className="mt-2"
                name="username"
                icon={User}
                required
                placeholder="Enter your username"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <Input
                className="mt-2"
                name="password"
                type="password"
                icon={LockKeyhole}
                required
                placeholder="Enter your password"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"} <ArrowRight size={17} />
            </Button>
          </form>
          <p className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link className="font-semibold text-aqua underline" to="/signup">
              Sign up
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
