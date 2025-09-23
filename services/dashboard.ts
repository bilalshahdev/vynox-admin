// services/dashboard.ts
import { api } from "@/lib/api";
import type {
  GetDashboardStatsResponse,
  DashboardStats,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

/**
 * If your route is different (e.g., /dashboard/stats), adjust here.
 */
export const getDashboardStats =
  async (): Promise<GetDashboardStatsResponse> => {
    const res = await api.get("/dashboard");
    return res.data;
  };

// For convenience in components that expect the unwrapped shape
export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  const res = await getDashboardStats();
  return res.success ? (res as ApiSuccessItem<DashboardStats>).data : null;
};
