import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import { Toast } from "./components/Toast";
import { router } from "./app/router";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AlertProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true } as any} />
      <Toast />
    </AlertProvider>
  </React.StrictMode>
);
