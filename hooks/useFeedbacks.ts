// hooks/useFeedback.ts
import {
  createFeedback,
  deleteFeedback,
  getFeedback,
  getFeedbackItem,
  updateFeedback,
} from "@/services/feedbacks";
import type { ListFeedbackQuery } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetFeedback = (
  query: ListFeedbackQuery = { page: 1, limit: 20 }
) =>
  useQuery({
    queryKey: [
      "feedback",
      query.page,
      query.limit,
      query.os_type,
      query.reason,
      query.rating,
    ],
    queryFn: () => getFeedback(query),
    placeholderData: (prev) => prev,
  });

export const useGetFeedbackItem = (id: string, enabled?: boolean) =>
  useQuery({
    queryKey: ["feedback-item", id],
    queryFn: () => getFeedbackItem(id),
    enabled,
    placeholderData: (prev) => prev,
  });

export const useAddFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"], exact: false });
      toast.success("Feedback submitted");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to submit feedback"),
  });
};

export const useUpdateFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateFeedback(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"], exact: false });
      qc.invalidateQueries({ queryKey: ["feedback-item"], exact: false });
      toast.success("Feedback updated");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update feedback"),
  });
};

export const useDeleteFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback"], exact: false });
      toast.success("Feedback deleted");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete feedback"),
  });
};
