// hooks/usePages.ts
import {
  createPage,
  deletePage,
  getPage,
  getPageByType,
  getPages,
  updatePage,
} from "@/services/pages";
import type { ListPagesQuery } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetPages = (query: ListPagesQuery = { page: 1, limit: 20 }) =>
  useQuery({
    queryKey: [
      "pages",
      query.page,
      query.limit,
      query.type,
      query.title,
      query.q,
    ],
    queryFn: () => getPages(query),
    placeholderData: (prev) => prev,
  });

export const useGetPage = (id: string, enabled?: boolean) =>
  useQuery({
    queryKey: ["page", id],
    queryFn: () => getPage(id),
    enabled,
    placeholderData: (prev) => prev,
  });

export const useGetPageByType = (type: string, enabled = true) =>
  useQuery({
    queryKey: ["page-by-type", type],
    queryFn: () => getPageByType(type),
    enabled,
    placeholderData: (prev) => prev,
  });

export const useAddPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"], exact: false });
      toast.success("Page created successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to create page"),
  });
};

export const useUpdatePage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePage(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"], exact: false });
      qc.invalidateQueries({ queryKey: ["page"], exact: false });
      qc.invalidateQueries({ queryKey: ["page-by-type"], exact: false });
      toast.success("Page updated successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update page"),
  });
};

export const useDeletePage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"], exact: false });
      toast.success("Page deleted successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete page"),
  });
};
