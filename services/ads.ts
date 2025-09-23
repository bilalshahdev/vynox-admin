// services/ads.ts
import { api } from "@/lib/api";
import type {
  Ad,
  ListAdsQuery,
  ListAdsResponse,
  GetAdByIdResponse,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

export const getAds = async (
  params?: ListAdsQuery
): Promise<ListAdsResponse> => {
  const res = await api.get("/ads", { params });
  return res.data;
};

export const getAd = async (id: string): Promise<GetAdByIdResponse> => {
  const res = await api.get(`/ads/${id}`);
  return res.data;
};

export const createAd = async (
  data: Omit<Ad, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Ad> | ApiError> => {
  const res = await api.post("/ads", data);
  return res.data;
};

export const updateAd = async (
  id: string,
  data: Partial<Omit<Ad, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Ad> | ApiError> => {
  const res = await api.patch(`/ads/${id}`, data);
  return res.data;
};

export const deleteAd = async (id: string) => {
  const res = await api.delete(`/ads/${id}`);
  return res.data;
};

// convenience for toggling status quickly
export const updateAdStatus = async (
  id: string,
  status: boolean
): Promise<ApiSuccessItem<Ad> | ApiError> => {
  const res = await api.patch(`/ads/${id}`, { status });
  return res.data;
};
