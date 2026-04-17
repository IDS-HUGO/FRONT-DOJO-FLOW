import axios from "axios";
import { LoginResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

function extractDetail(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (detail && typeof detail === "object") {
    const maybeMessage = (detail as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback = "Error al procesar la solicitud"): string {
  if (axios.isAxiosError(error)) {
    const detail = extractDetail(error.response?.data?.detail);
    if (detail) {
      return detail;
    }

    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dojo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(username: string, password: string) {
  const payload = new URLSearchParams({ username, password });
  const { data } = await api.post<LoginResponse>("/auth/login", payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  localStorage.setItem("dojo_token", data.access_token);
  localStorage.setItem("dojo_user_email", username);
  localStorage.setItem("dojo_account_type", data.account_type || "staff");
  if (data.student_id) {
    localStorage.setItem("dojo_student_id", String(data.student_id));
  } else {
    localStorage.removeItem("dojo_student_id");
  }
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.post<{ message: string }>("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
}
