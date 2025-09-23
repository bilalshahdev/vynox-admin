// hooks/useAds.ts
import {
    createAd,
    deleteAd,
    getAd,
    getAds,
    updateAd,
    updateAdStatus,
  } from "@/services/ads";
  import type { ListAdsQuery } from "@/types/api.types";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  
  export const useGetAds = (query: ListAdsQuery = { page: 1, limit: 10 }) =>
    useQuery({
      queryKey: ["ads", query.page, query.limit, query.os_type, query.type, query.position, query.status],
      queryFn: () => getAds(query),
      placeholderData: (prev) => prev,
    });
  
  export const useGetAd = (adId: string, enabled?: boolean) =>
    useQuery({
      queryKey: ["ad", adId],
      queryFn: () => getAd(adId),
      enabled,
      placeholderData: (prev) => prev,
    });
  
  export const useAddAd = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: createAd,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["ads"], exact: false });
        toast.success("Ad created successfully");
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.message || "Failed to create ad"),
    });
  };
  
  export const useUpdateAd = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => updateAd(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["ads"], exact: false });
        qc.invalidateQueries({ queryKey: ["ad"], exact: false });
        toast.success("Ad updated successfully");
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.message || "Failed to update ad"),
    });
  };
  
  export const useDeleteAd = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deleteAd(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["ads"], exact: false });
        toast.success("Ad deleted successfully");
      },
      onError: (e: any) =>
        toast.error(e?.response?.data?.message || "Failed to delete ad"),
    });
  };
  
  export const useUpdateAdStatus = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: boolean }) =>
        updateAdStatus(id, status),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["ads"], exact: false });
        qc.invalidateQueries({ queryKey: ["ad"], exact: false });
      },
    });
  };
  