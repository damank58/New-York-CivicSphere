export type Source = {
  title: string;
  url?: string;
  score?: number;
  content?: string;
};

export type ChatMessage = {
  id: string;
  author: "user" | "assistant";
  content: string;
  timestamp: string;
  variant?: "info" | "success";
  sources?: Source[];
};

export type ChatRequest = {
  message: string;
};

export type ChatResponse = {
  response: string;
  sources: Source[];
};

