import { Link } from "react-router"
import { Button } from "../components/ui"

export default function NotFoundPage() {
  return (
    <div className="page-container grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-5xl font-bold">
          This page stepped out.
        </h1>
        <p className="mt-4 text-muted">
          The work you are looking for may have moved.
        </p>
        <Link to="/">
          <Button className="mt-7">Return home</Button>
        </Link>
      </div>
    </div>
  )
}
