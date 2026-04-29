import type { ID } from "./common";

export interface User {
  id: ID;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokenPayload {
  sub: ID;
  email: string;
  iat?: number;
  exp?: number;
}
