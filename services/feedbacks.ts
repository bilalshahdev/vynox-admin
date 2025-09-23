// services/feedbacks.ts
import { api } from "@/lib/api";
import type {
  Feedback,
  ListFeedbackQuery,
  ListFeedbackResponse,
  GetFeedbackByIdResponse,
  ApiSuccessItem,
  ApiError,
} from "@/types/api.types";

export const getFeedback = async (
  params?: ListFeedbackQuery
): Promise<ListFeedbackResponse> => {
  const res = await api.get("/feedbacks", { params });
  return res.data;
};

export const getFeedbackItem = async (
  id: string
): Promise<GetFeedbackByIdResponse> => {
  const res = await api.get(`/feedbacks/${id}`);
  return res.data;
};

export const createFeedback = async (
  data: Omit<Feedback, "_id" | "created_at" | "updated_at">
): Promise<ApiSuccessItem<Feedback> | ApiError> => {
  const res = await api.post("/feedbacks", data);
  return res.data;
};

export const updateFeedback = async (
  id: string,
  data: Partial<Omit<Feedback, "_id" | "created_at" | "updated_at">>
): Promise<ApiSuccessItem<Feedback> | ApiError> => {
  const res = await api.patch(`/feedbacks/${id}`, data);
  return res.data;
};

export const deleteFeedback = async (id: string) => {
  const res = await api.delete(`/feedbacks/${id}`);
  return res.data;
};
