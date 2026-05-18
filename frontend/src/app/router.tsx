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
import { RoleRoute } from "../routes/RoleRoute";
import AdminDashboard from "../pages/AdminDashboard";
import BlogDetailsPage from "../pages/BlogDetailsPage";
import EditBlogPage from "../pages/EditBlog";

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
          { path: "blogs", element: <Blogs /> },
          { path: "blog/:id", element: <BlogDetailsPage /> },
        ],
      },

      // Author and Admin routes
      {
        element: <RoleRoute allowedRoles={["author", "admin"]} />,
        children: [
          { path: "create-blog", element: <CreateBlog /> },
          { path: "blog/edit/:id", element: <EditBlogPage /> },
        ],
      },

      //  Admin only

      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [{ path: "admin-dashboard", element: <AdminDashboard /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
