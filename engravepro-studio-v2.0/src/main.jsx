import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import App from "./pages/App.jsx";
import Admin from "./pages/Admin.jsx";
import "./styles.css";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/app", element: <App /> },
  { path: "/admin", element: <Admin /> }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);