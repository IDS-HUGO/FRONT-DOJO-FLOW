import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import AdminDashboard from "../pages/AdminDashboard";
import { AttendancePage } from "../pages/AttendancePage";
import { BeltsPage } from "../pages/BeltsPage";
import { CouponsPage } from "../pages/CouponsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { MarketplacePage } from "../pages/MarketplacePage";
import { PaymentsPage } from "../pages/PaymentsPage";
import { PlansPage } from "../pages/PlansPage";
import { ReportsPage } from "../pages/ReportsPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { SchedulesPage } from "../pages/SchedulesPage";
import { SettingsPage } from "../pages/SettingsPage";
import { StudentPortalPage } from "../pages/StudentPortalPage";
import { StudentsPage } from "../pages/StudentsPage";
import { TeachersPage } from "../pages/TeachersPage";

function protectedLoader() {
  const token = localStorage.getItem("dojo_token");
  const accountType = localStorage.getItem("dojo_account_type");
  if (!token || accountType === "student") {
    throw new Response("Unauthorized", { status: 401 });
  }
  return null;
}

function studentLoader() {
  const token = localStorage.getItem("dojo_token");
  const accountType = localStorage.getItem("dojo_account_type");
  if (!token || accountType !== "student") {
    throw redirect("/student/login");
  }
  return null;
}

function ownerOnlyLoader() {
  const token = localStorage.getItem("dojo_token");
  const email = localStorage.getItem("dojo_user_email");

  if (!token || email !== "owner@dojoflow.com") {
    throw redirect("/login");
  }

  return redirect("/app/settings");
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/student/login",
    element: <LoginPage />,
  },
  {
    path: "/student",
    element: <StudentPortalPage />,
    loader: studentLoader,
    errorElement: <Navigate to="/student/login" replace />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/register",
    loader: ownerOnlyLoader,
  },
  {
    path: "/app",
    element: <AppLayout />,
    loader: protectedLoader,
    errorElement: <Navigate to="/login" replace />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "students", element: <StudentsPage /> },
      { path: "attendance", element: <AttendancePage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "belts", element: <BeltsPage /> },
      { path: "plans", element: <PlansPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "schedules", element: <SchedulesPage /> },
      { path: "coupons", element: <CouponsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
