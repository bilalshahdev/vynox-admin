import {
  searchCountries,
  getCountries,
  getCountry,
  addCountry,
  updateCountry,
  deleteCountry,
} from "@/services/country";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSearchCountries = (query: string, limit = 20, enabled = true) =>
  useQuery({
    queryKey: ["countries-search", query, limit],
    queryFn: () => searchCountries({ query, limit }),
    enabled: !!query && enabled,
    placeholderData: (prev) => prev,
  });

export const useGetCountries = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["countries", page, limit],
    queryFn: () => getCountries({ page, limit }),
    placeholderData: (prev) => prev,
  });

export const useGetCountry = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["country", id],
    queryFn: () => getCountry(id),
    enabled: !!id && enabled,
    placeholderData: (prev) => prev,
  });

export const useAddCountry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCountry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country added successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to add country"),
  });
};

export const useUpdateCountry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCountry(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["countries"] });
      qc.invalidateQueries({ queryKey: ["country"] });
      toast.success("Country updated successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update country"),
  });
};

export const useDeleteCountry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCountry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country deleted successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete country"),
  });
};
