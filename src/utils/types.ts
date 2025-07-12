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
