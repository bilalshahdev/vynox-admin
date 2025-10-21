// hooks/useRedis.ts
import { useMutation } from "@tanstack/react-query";
import { resetRedis } from "@/services/redis";
import { toast } from "sonner";

export const useRedis = () => {
  return useMutation({
    mutationFn: resetRedis,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Redis reset successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to reset Redis");
    },
  });
};
