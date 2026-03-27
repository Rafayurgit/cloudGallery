const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

type ApiOptions = {
  method?: "GET" | "POST" | "DELETE";
  token?: string | null;
  body?: unknown;
  formData?: FormData;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const buildHeaders = (token?: string | null, formData?: FormData) => {
  const headers: Record<string, string> = {};
  if (!formData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiRequest = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: buildHeaders(options.token, options.formData),
    credentials: "include",
    body: options.formData || (options.body ? JSON.stringify(options.body) : undefined)
  });

  const payload = (await response.json()) as ApiResponse<T> | { success: false; message: string };
  if (!response.ok || !("success" in payload) || !payload.success) {
    const message = "message" in payload ? payload.message : "Request failed";
    throw new Error(message);
  }
  return payload.data;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
};

export type AuthPayload = {
  tenantId: string;
  email: string;
  password: string;
  name?: string;
};

export type FileItem = {
  _id: string;
  fileName: string;
  provider: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

export const registerUser = async (input: Required<Pick<AuthPayload, "tenantId" | "name" | "email" | "password">>) => {
  return apiRequest<{ user: AuthUser }>("/auth/register", { method: "POST", body: input });
};

export const loginUser = async (input: Required<Pick<AuthPayload, "tenantId" | "email" | "password">>) => {
  return apiRequest<{ user: AuthUser; accessToken: string }>("/auth/login", { method: "POST", body: input });
};

export const refreshToken = async () => {
  return apiRequest<{ accessToken: string }>("/auth/refresh", { method: "POST", body: {} });
};

export const getGoogleAuthUrl = async (token: string) => {
  return apiRequest<{ url: string }>("/providers/google/auth-url", { token });
};

export const getFiles = async (token: string) => {
  return apiRequest<FileItem[]>("/files", { token });
};

export const uploadFile = async (token: string, file: File, provider = "google") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("provider", provider);
  return apiRequest<FileItem>("/files/upload", { method: "POST", token, formData });
};

export const deleteFile = async (token: string, fileId: string) => {
  return apiRequest<{}>(`/files/${fileId}`, { method: "DELETE", token });
};
