// services/pages.ts
import { api } from "@/lib/api";
import type {
  Page,
  ListPagesQuery,
  ListPagesResponse,
  GetPageByIdResponse,
  GetPageByTypeResponse,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

export const getPages = async (
  params?: ListPagesQuery
): Promise<ListPagesResponse> => {
  const res = await api.get("/pages", { params });
  return res.data;
};

export const getPage = async (id: string): Promise<GetPageByIdResponse> => {
  const res = await api.get(`/pages/${id}`);
  return res.data;
};

export const getPageByType = async (
  type: string
): Promise<GetPageByTypeResponse> => {
  const res = await api.get(`/pages/type/${type}`);
  return res.data;
};

export const createPage = async (
  data: Omit<Page, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Page> | ApiError> => {
  const res = await api.post("/pages", data);
  return res.data;
};

export const updatePage = async (
  id: string,
  data: Partial<Omit<Page, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Page> | ApiError> => {
  const res = await api.patch(`/pages/${id}`, data);
  return res.data;
};

export const deletePage = async (id: string) => {
  const res = await api.delete(`/pages/${id}`);
  return res.data;
};
