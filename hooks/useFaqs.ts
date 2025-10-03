// hooks/useFaqs.ts
import {
  searchFaqs,
  getFaqs,
  getFaq,
  addFaq,
  updateFaq,
  deleteFaq,
} from "@/services/faqs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// 🔎 Search FAQs
export const useSearchFaqs = (query: string, limit = 20, enabled = true) =>
  useQuery({
    queryKey: ["faqs-search", query, limit],
    queryFn: () => searchFaqs({ query, limit }),
    enabled: !!query && enabled,
    placeholderData: (prev) => prev,
  });

// 📃 Get FAQs with pagination
export const useGetFaqs = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["faqs", page, limit],
    queryFn: () => getFaqs({ page, limit }),
    placeholderData: (prev) => prev,
  });

// 📄 Get single FAQ
export const useGetFaq = (faqId: string, enabled = true) =>
  useQuery({
    queryKey: ["faq", faqId],
    queryFn: () => getFaq(faqId),
    enabled: !!faqId && enabled,
    placeholderData: (prev) => prev,
  });

// ➕ Add FAQ
export const useAddFaq = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"], exact: false });
      toast.success("FAQ created successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to create FAQ"),
  });
};

// ✏️ Update FAQ
export const useUpdateFaq = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ faqId, data }: { faqId: string; data: any }) =>
      updateFaq(faqId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"], exact: false });
      qc.invalidateQueries({ queryKey: ["faq"], exact: false });
      toast.success("FAQ updated successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to update FAQ"),
  });
};

// 🗑️ Delete FAQ
export const useDeleteFaq = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (faqId: string) => deleteFaq(faqId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"], exact: false });
      toast.success("FAQ deleted successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to delete FAQ"),
  });
};
