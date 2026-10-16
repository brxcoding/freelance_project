import { createBrowserRouter } from "react-router"
import RootLayout from "../components/RootLayout"
import AdminPage from "../pages/AdminPage"
import DashboardPage from "../pages/DashboardPage"
import ExplorePage from "../pages/ExplorePage"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import MessagesPage from "../pages/MessagesPage"
import NotFoundPage from "../pages/NotFoundPage"
import ServicePage from "../pages/ServicePage"
import SignupPage from "../pages/SignupPage"
import StaticPage from "../pages/StaticPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "services/:id", element: <ServicePage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "dashboard/:role", element: <DashboardPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "about", element: <StaticPage type="about" /> },
      { path: "contact", element: <StaticPage type="contact" /> },
      { path: "login", element: <LoginPage /> },   
      { path: "signup", element: <SignupPage /> },   
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])


