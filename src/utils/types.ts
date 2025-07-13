import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "driver" | "customer";

export interface UserType {
  id: string; // Firebase UID
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LeadType {
  id: string;
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropOff: string;
  notes: string;
  distance: number;
  price: number;
  timestamp: Timestamp;
  contacted?: boolean;
}
