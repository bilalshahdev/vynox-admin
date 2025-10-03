// hooks/useConnectivity.ts
import {
  createConnectivity,
  deleteConnectivity,
  getConnectivity,
  getConnectivityItem,
  updateConnectivity,
  getServersWithConnectionStats,
  ServersWithStatsQuery,
} from "@/services/connectivity";
import type { ListConnectivityQuery } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetServersWithConnectionStats = (
  params?: ServersWithStatsQuery
) =>
  useQuery({
    queryKey: ["servers-with-connection-stats", params],
    queryFn: () => getServersWithConnectionStats(params),
    placeholderData: (prev) => prev,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    notifyOnChangeProps: ["data"],
  });

export const useGetConnectivity = (
  query: ListConnectivityQuery = { page: 1, limit: 20 }
) =>
  useQuery({
    queryKey: [
      "connectivity",
      query.page,
      query.limit,
      query.user_id,
      query.server_id,
      query.from,
      query.to,
    ],
    queryFn: () => getConnectivity(query),
    placeholderData: (prev) => prev,
  });

export const useGetConnectivityItem = (id: string, enabled?: boolean) =>
  useQuery({
    queryKey: ["connectivity-item", id],
    queryFn: () => getConnectivityItem(id),
    enabled,
    placeholderData: (prev) => prev,
  });

export const useAddConnectivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createConnectivity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connectivity"], exact: false });
      toast.success("Connectivity record created");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to create record"),
  });
};

export const useUpdateConnectivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateConnectivity(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connectivity"], exact: false });
      qc.invalidateQueries({ queryKey: ["connectivity-item"], exact: false });
      toast.success("Connectivity record updated");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update record"),
  });
};

export const useDeleteConnectivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteConnectivity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["connectivity"], exact: false });
      toast.success("Connectivity record deleted");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete record"),
  });
};
