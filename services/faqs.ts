// faqs.ts

import { api } from "@/lib/api";
import { ApiResponse, Faq } from "@/types/api.types";

export type GetFaqsResponse = ApiResponse<Faq[]>;

export const searchFaqs = async ({
  query,
  limit = 20,
}: {
  query: string;
  limit: number;
}) => {
  const response = await api.get<GetFaqsResponse>(
    `/faqs/search?q=${query}&limit=${limit}`
  );
  return response.data;
};

export const getFaqs = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}): Promise<GetFaqsResponse> => {
  const response = await api.get<GetFaqsResponse>(
    `/faqs?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getFaq = async (faqId: string) => {
  const response = await api.get(`/faqs/${faqId}`);
  return response.data;
};

export const addFaq = async (faqData: any) => {
  const response = await api.post("/faqs", faqData);
  return response.data;
};

export const updateFaq = async (faqId: string, faqData: any) => {
  const response = await api.patch(`/faqs/${faqId}`, faqData);
  return response.data;
};

export const deleteFaq = async (faqId: string) => {
  const response = await api.delete(`/faqs/${faqId}`);
  return response.data;
};
