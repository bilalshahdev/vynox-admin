// services/dropdowns.ts
import { api } from "@/lib/api";
import type {
  Dropdown,
  ListDropdownsQuery,
  ListDropdownsResponse,
  GetDropdownByIdResponse,
  GetDropdownByNameResponse,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

export const getDropdowns = async (
  params?: ListDropdownsQuery
): Promise<ListDropdownsResponse> => {
  const res = await api.get("/dropdowns", { params });
  return res.data;
};

export const getDropdown = async (
  id: string
): Promise<GetDropdownByIdResponse> => {
  const res = await api.get(`/dropdowns/${id}`);
  return res.data;
};

export const getDropdownByName = async (
  name: string
): Promise<GetDropdownByNameResponse> => {
  const res = await api.get(`/dropdowns/name/${name}`);
  return res.data;
};

export const createDropdown = async (
  data: Omit<Dropdown, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Dropdown> | ApiError> => {
  const res = await api.post("/dropdowns", data);
  return res.data;
};

export const updateDropdown = async (
  id: string,
  data: Partial<Omit<Dropdown, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Dropdown> | ApiError> => {
  const res = await api.patch(`/dropdowns/${id}`, data);
  return res.data;
};

export const deleteDropdown = async (id: string) => {
  const res = await api.delete(`/dropdowns/${id}`);
  return res.data;
};
