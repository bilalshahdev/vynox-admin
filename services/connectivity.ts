// services/connectivity.ts
import { api } from "@/lib/api";
import type {
  Connectivity,
  ListConnectivityQuery,
  ListConnectivityResponse,
  GetConnectivityByIdResponse,
  ApiSuccessItem,
  ApiError,
  ApiResponse,
  ConnectivityServer,
} from "@/types/api.types";

// Response type for the servers-with-stats endpoint
type ConnectivityServerResponse = ApiResponse<ConnectivityServer[]>;

// Query type for servers-with-stats (with new filters)
export type ServersWithStatsQuery = {
  page?: number;
  limit?: number;
  os_type?: "android" | "ios";
  search?: string;
};

/**
 * Get servers with connection statistics
 * Supports pagination + filtering (os_type, search)
 */
export const getServersWithConnectionStats = async (
  params?: ServersWithStatsQuery
): Promise<ConnectivityServerResponse> => {
  const res = await api.get("/connectivity/servers", { params });
  return res.data;
};

/**
 * List connectivity records (history / sessions)
 */
export const getConnectivity = async (
  params?: ListConnectivityQuery
): Promise<ListConnectivityResponse> => {
  const res = await api.get("/connectivity", { params });
  return res.data;
};

/**
 * Get single connectivity item by ID
 */
export const getConnectivityItem = async (
  id: string
): Promise<GetConnectivityByIdResponse> => {
  const res = await api.get(`/connectivity/${id}`);
  return res.data;
};

/**
 * Create new connectivity record (connect)
 */
export const createConnectivity = async (
  data: Omit<Connectivity, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Connectivity> | ApiError> => {
  const res = await api.post("/connectivity", data);
  return res.data;
};

/**
 * Update connectivity record (generic)
 */
export const updateConnectivity = async (
  id: string,
  data: Partial<Omit<Connectivity, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Connectivity> | ApiError> => {
  const res = await api.patch(`/connectivity/${id}`, data);
  return res.data;
};

/**
 * Delete connectivity record by ID
 */
export const deleteConnectivity = async (id: string) => {
  const res = await api.delete(`/connectivity/${id}`);
  return res.data;
};
