// services/dashboard.ts
import { api } from "@/lib/api";
import type {
  ApiSuccessItem,
  DashboardStats,
  GetDashboardStatsResponse
} from "@/types/api.types";

export const getDashboardStats =
  async (): Promise<GetDashboardStatsResponse> => {
    const res = await api.get("/dashboard");
    return res.data;
  };

export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  const res = await getDashboardStats();
  return res.success ? (res as ApiSuccessItem<DashboardStats>).data : null;
};
