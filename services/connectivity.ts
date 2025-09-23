// services/connectivity.ts
import { api } from "@/lib/api";
import type {
  Connectivity,
  ListConnectivityQuery,
  ListConnectivityResponse,
  GetConnectivityByIdResponse,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

export const getConnectivity = async (
  params?: ListConnectivityQuery
): Promise<ListConnectivityResponse> => {
  const res = await api.get("/connectivity", { params });
  return res.data;
};

export const getConnectivityItem = async (
  id: string
): Promise<GetConnectivityByIdResponse> => {
  const res = await api.get(`/connectivity/${id}`);
  return res.data;
};

export const createConnectivity = async (
  data: Omit<Connectivity, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Connectivity> | ApiError> => {
  const res = await api.post("/connectivity", data);
  return res.data;
};

export const updateConnectivity = async (
  id: string,
  data: Partial<Omit<Connectivity, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Connectivity> | ApiError> => {
  const res = await api.patch(`/connectivity/${id}`, data);
  return res.data;
};

export const deleteConnectivity = async (id: string) => {
  const res = await api.delete(`/connectivity/${id}`);
  return res.data;
};
