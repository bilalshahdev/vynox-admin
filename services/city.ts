import { api } from "@/lib/api";
import { ApiResponse, City } from "@/types/api.types";

export type GetCitiesResponse = ApiResponse<City[]>;

export const searchCities = async ({
  query,
  limit = 20,
}: {
  query: string;
  limit: number;
}) => {
  const response = await api.get<GetCitiesResponse>(
    `/cities/search?q=${query}&limit=${limit}`
  );
  return response.data;
};

export const getCities = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}): Promise<GetCitiesResponse> => {
  const response = await api.get<GetCitiesResponse>(
    `/cities?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCity = async (id: string) => {
  const response = await api.get<ApiResponse<City>>(`/cities/${id}`);
  return response.data;
};

export const addCity = async (city: Partial<City>) => {
  const payload = {
    ...city,
    country_id:
      typeof city.country === "string" ? city.country : city.country?._id,
  };
  const response = await api.post<ApiResponse<City>>(`/cities`, payload);
  return response.data;
};

export const updateCity = async (id: string, city: Partial<City>) => {
  const payload = {
    ...city,
    country_id:
      typeof city.country === "string" ? city.country : city.country?._id,
  };
  const response = await api.patch<ApiResponse<City>>(`/cities/${id}`, payload);
  return response.data;
};

export const deleteCity = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/cities/${id}`);
  return response.data;
};
