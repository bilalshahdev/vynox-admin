import { api } from "@/lib/api";
import { ApiResponse, Country } from "@/types/api.types";

export type GetCountriesResponse = ApiResponse<Country[]>;

export const searchCountries = async ({
  query,
  limit = 20,
}: {
  query: string;
  limit: number;
}) => {
  const response = await api.get<GetCountriesResponse>(
    `/countries/search?q=${query}&limit=${limit}`
  );
  return response.data;
};

export const getCountries = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}): Promise<GetCountriesResponse> => {
  const response = await api.get<GetCountriesResponse>(
    `/countries?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCountry = async (id: string) => {
  const response = await api.get<ApiResponse<Country>>(`/countries/${id}`);
  return response.data;
};

export const addCountry = async (country: Partial<Country>) => {
  const response = await api.post<ApiResponse<Country>>(`/countries`, country);
  return response.data;
};

export const updateCountry = async (id: string, country: Partial<Country>) => {
  const response = await api.patch<ApiResponse<Country>>(
    `/countries/${id}`,
    country
  );
  return response.data;
};

export const deleteCountry = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/countries/${id}`);
  return response.data;
};
