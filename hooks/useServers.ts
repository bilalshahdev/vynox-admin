// src/hooks/useServers.ts
import {
  createServer,
  deleteServer,
  getServer,
  getServers,
  updateOpenVpnConfig,
  updateServer,
  updateServerMode,
  updateServerProStatus,
  updateWireguardConfig,
} from "@/services/servers";
import { ListServersQuery, ServerMode } from "@/types/api.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

/** LIST */
export const useGetServers = ({
  page = 1,
  limit = 10,
  os_type,
  mode,
  search,
}: ListServersQuery) =>
  useQuery({
    queryKey: [
      "servers",
      page,
      limit,
      os_type ?? "all",
      mode ?? "all",
      search ?? "",
    ],
    queryFn: () => getServers({ page, limit, os_type, mode, search }),
    placeholderData: keepPreviousData,
  });

/** BY ID (accepts options object for enabled) */
export const useGetServer = (
  serverId?: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["server", serverId],
    queryFn: () => getServer(String(serverId)),
    enabled: options?.enabled ?? Boolean(serverId),
    placeholderData: keepPreviousData,
  });

/** CREATE */
export const useAddServer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["servers"] });
      toast.success("Server added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

/** UPDATE */
export const useUpdateServer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateServer(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["servers"] });
      qc.invalidateQueries({ queryKey: ["server", variables.id] });
      toast.success("Server updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

/** DELETE */
export const useDeleteServer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServer(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["servers"] });
      qc.invalidateQueries({ queryKey: ["server", id] });
      toast.success("Server deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

/** PATCH: MODE */
export const useUpdateServerMode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: ServerMode }) =>
      updateServerMode(id, mode),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["servers"] });
      qc.invalidateQueries({ queryKey: ["server", vars.id] });
    },
  });
};

/** PATCH: PRO STATUS */
export const useUpdateServerProStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_pro }: { id: string; is_pro: boolean }) =>
      updateServerProStatus(id, is_pro),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["servers"] });
      qc.invalidateQueries({ queryKey: ["server", vars.id] });
    },
  });
};

/** PATCH: OpenVPN config */
export const useUpdateOpenVpnConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { username?: string; password?: string; config?: string };
    }) => updateOpenVpnConfig(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["server", vars.id] });
    },
  });
};

/** PATCH: WireGuard config */
export const useUpdateWireguardConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { address?: string; config?: string };
    }) => updateWireguardConfig(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["server", vars.id] });
    },
  });
};
