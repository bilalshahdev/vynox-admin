// services/servers.ts
import { api } from "@/lib/api";
import { ServerFormValues } from "@/lib/validation";
import type {
  ListServerResponse,
  ListServersQuery,
  MutateServerResponse,
  OpenVPNConfig,
  ServerByIdResponse,
  ServerMode,
  UpdateServerRequest,
  WireguardConfig,
} from "@/types/api.types";

export const getServers = async (
  params?: ListServersQuery
): Promise<ListServerResponse> => {
  const response = await api.get("/servers", { params });
  return response.data;
};

export const getServer = async (id: string): Promise<ServerByIdResponse> => {
  const response = await api.get(`/servers/${id}`);
  return response.data;
};

export const createServer = async (
  data: ServerFormValues
): Promise<MutateServerResponse> => {
  const response = await api.post("/servers", data);
  return response.data;
};

export const updateServer = async (
  id: string,
  data: UpdateServerRequest
): Promise<MutateServerResponse> => {
  const response = await api.patch(`/servers/${id}`, data);
  return response.data;
};

export const deleteServer = async (id: string) => {
  const response = await api.delete(`/servers/${id}`);
  return response.data;
};

export const updateServerMode = async (
  id: string,
  mode: ServerMode
): Promise<MutateServerResponse> => {
  const response = await api.patch(`/servers/${id}/mode`, { mode });
  return response.data;
};

export const updateServerProStatus = async (
  id: string,
  is_pro: boolean
): Promise<MutateServerResponse> => {
  const response = await api.patch(`/servers/${id}/is-pro`, { is_pro });
  return response.data;
};

export const updateOpenVpnConfig = async (
  id: string,
  data: OpenVPNConfig
): Promise<MutateServerResponse> => {
  const response = await api.patch(`/servers/${id}/openvpn-config`, data);
  return response.data;
};

export const updateWireguardConfig = async (
  id: string,
  data: WireguardConfig
): Promise<MutateServerResponse> => {
  const response = await api.patch(`/servers/${id}/wireguard-config`, data);
  return response.data;
};
