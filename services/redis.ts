// services/redis.ts
import { api } from "@/lib/api";
import { RedisResetType } from "@/types/api.types";

// /redis/reset?group=param
export const resetRedis = async (
  params?: { group?: RedisResetType } // make group optional
): Promise<{ success: boolean; message: string }> => {
  const res = await api.get("/redis/reset", { params });
  return res.data;
};
