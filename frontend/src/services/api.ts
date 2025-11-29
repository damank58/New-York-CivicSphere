import axios from "axios";
import type { DashboardResponse, ServiceAlertsResponse } from "../types/dashboard";

const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

export const fetchDashboard = async (): Promise<DashboardResponse> => {
  const { data } = await api.get<DashboardResponse>("/dashboard");
  return data;
};

export const fetchAISummary = async (): Promise<string | undefined> => {
  const { data } = await api.post<{ message?: string; summary?: string }>("/dashboard/ai-summary");
  return data.summary ?? data.message;
};

export const fetchServiceAlerts = async (): Promise<ServiceAlertsResponse> => {
  const { data } = await api.get<ServiceAlertsResponse>("/dashboard/service-alerts");
  return data;
};

export default api;

