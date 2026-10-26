export type Role = "ADMIN" | "USER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export const STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  user_id: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TicketInput {
  title: string;
  description: string;
  status?: TicketStatus;
}
