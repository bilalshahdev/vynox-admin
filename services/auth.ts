// services/auth.ts

import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

interface LoginData {
  email: string;
  password: string;
}

type LoginResponse = ApiResponse<{ email: string; token: string }>;

// in res data i have userAgent, token
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
