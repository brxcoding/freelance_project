import { Link } from "react-router"
import Brand from "./Brand"

export default function Footer() {
  return (
    <footer className="bg-aqua py-14 text-white/75">
      <div className="page-container grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Brand inverse />
          <p className="mt-5 max-w-sm leading-7">
            The professional marketplace for independent talent and ambitious
            teams, built around clear work and secure collaboration.
          </p>
        </div>
        <div>
          <p className="footer-title">Marketplace</p>
          <Link to="/explore">Explore services</Link>
          <Link to="/signup">Become a freelancer</Link>
          <Link to="/about">How it works</Link>
        </div>
        <div>
          <p className="footer-title">Company</p>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="mailto:support@freelancemkt.com">Support</a>
        </div>
      </div>
      <div className="page-container mt-12 border-t border-white/15 pt-6 text-sm">
        © {new Date().getFullYear()} FreelanceMKT. Built for meaningful work.
      </div>
    </footer>
  )
}
