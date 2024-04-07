import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authentication";
import RequireAuth from "./util/RequireAuth";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import RequireNoAuth from "./util/RequireNoAuth";
import DashboardLayout from "./layout/dashboard";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Enquiries from "./pages/Enquiries";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/modals";
import Enquiry from "./pages/Enquiry";
import Ticket from "./pages/Ticket";
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "enquiries",
        element: <Enquiries />,
      },
      {
        path: "enquiry/:id",
        element: <Enquiry />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <RequireNoAuth>
        <Login />
      </RequireNoAuth>
    ),
  },
  {
    path: "signup",
    element: (
      <RequireNoAuth>
        <Signup />
      </RequireNoAuth>
    ),
  },
  {
    path: "ticket/:id",
    element: <Ticket />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-left"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "flex-start",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </ModalProvider>
    </AuthProvider>
  );
}
