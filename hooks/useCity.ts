import {
  searchCities,
  getCities,
  getCity,
  addCity,
  updateCity,
  deleteCity,
} from "@/services/city";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSearchCities = (query: string, limit = 20, enabled = true) =>
  useQuery({
    queryKey: ["cities-search", query, limit],
    queryFn: () => searchCities({ query, limit }),
    enabled: !!query && enabled,
    placeholderData: (prev) => prev,
  });

export const useGetCities = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["cities", page, limit],
    queryFn: () => getCities({ page, limit }),
    placeholderData: (prev) => prev,
  });

export const useGetCity = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["city", id],
    queryFn: () => getCity(id),
    enabled: !!id && enabled,
    placeholderData: (prev) => prev,
  });

export const useAddCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City added successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to add city"),
  });
};

export const useUpdateCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCity(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      qc.invalidateQueries({ queryKey: ["city"] });
      toast.success("City updated successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update city"),
  });
};

export const useDeleteCity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City deleted successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete city"),
  });
};
