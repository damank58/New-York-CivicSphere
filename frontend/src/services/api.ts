import axios from "axios";
import type { DashboardResponse, ServiceAlertsResponse } from "../types/dashboard";
import type { ChatRequest, ChatResponse } from "../types/chat";
import type { ForumResponse, ForumThreadResponse, CreatePostRequest } from "../types/forum";

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

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>("/chat", { message } as ChatRequest);
  return data;
};

export const fetchForumThreads = async (): Promise<ForumResponse> => {
  const { data } = await api.get<ForumResponse>("/forum/threads");
  return data;
};

export const fetchThreadDetail = async (threadId: string): Promise<ForumThreadResponse> => {
  const { data } = await api.get<ForumThreadResponse>(`/forum/threads/${threadId}`);
  return data;
};

export const createPost = async (threadId: string, request: CreatePostRequest): Promise<ForumThreadResponse> => {
  const { data } = await api.post<ForumThreadResponse>(`/forum/threads/${threadId}/posts`, request);
  return data;
};

export default api;

