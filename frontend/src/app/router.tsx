import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/Mainlayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard"; // Your protected page
import CreateBlog from "../pages/CreateBlog";
import Blogs from "../pages/Blogs";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { PublicRoute } from "../routes/PublicRoute";
import NotFound from "../pages/NotFound";
import AdminSignup from "../pages/AdminSignup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          { path: "admin-signup", element: <AdminSignup /> },
        ],
      },

      // Protected nested routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "create-blog", element: <CreateBlog /> },
          { path: "blogs", element: <Blogs /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
