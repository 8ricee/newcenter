// src/auth.ts
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export function auth() {
  return getServerSession(authOptions);
}
