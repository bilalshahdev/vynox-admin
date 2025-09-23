// hooks/useDashboard.ts
import { getDashboardStats } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

/**
 * Polling example: refetch every 30s for live tiles.
 * Tune 'refetchInterval' or remove it if not needed.
 */
export const useDashboardStats = (enabled = true) =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    enabled,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
    placeholderData: (prev) => prev,
  });
