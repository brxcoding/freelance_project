import { Outlet } from "react-router"
import Footer from "./Footer"
import Navbar from "./Navbar"

import { AuthProvider } from "../context/AuthContext"
import { NotificationProvider } from "../context/NotificationContext"
import { ThemeProvider } from "../context/ThemeContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <div>
            <Navbar />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

