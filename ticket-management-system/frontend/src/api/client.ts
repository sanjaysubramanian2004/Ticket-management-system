import type { Ticket, TicketInput, User } from "../types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
const TOKEN_KEY = "access_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// FastAPI returns {detail: string} or {detail: [{loc, msg}, ...]}
function extractMessage(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { loc?: (string | number)[]; msg?: string }) => {
        const field = d.loc?.[d.loc.length - 1];
        const msg = (d.msg ?? "Invalid value").replace(/^Value error, /, "");
        return field && field !== "body" ? `${String(field)}: ${msg}` : msg;
      })
      .join("; ");
  }
  return fallback;
}

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

async function request<T>(path: string, options: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Cannot reach the server. Check that the backend is running.", 0);
  }

  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized();
    throw new ApiError(extractMessage(body, `Request failed (${res.status})`), res.status);
  }
  return body as T;
}

export interface AiAssist {
  summary: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  suggested_reply: string;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<User>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }, false),
  login: (email: string, password: string) =>
    request<{ access_token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, false),
  me: () => request<User>("/api/auth/me"),
  listTickets: () => request<Ticket[]>("/api/tickets"),
  getTicket: (id: string | number) => request<Ticket>(`/api/tickets/${id}`),
  createTicket: (data: TicketInput) => request<Ticket>("/api/tickets", { method: "POST", body: JSON.stringify(data) }),
  updateTicket: (id: string | number, data: TicketInput) =>
    request<Ticket>(`/api/tickets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTicket: (id: number) => request<void>(`/api/tickets/${id}`, { method: "DELETE" }),
  listUsers: () => request<User[]>("/api/users"),
  aiAssist: (id: number) => request<AiAssist>(`/api/ai/tickets/${id}/assist`, { method: "POST" }),
};
