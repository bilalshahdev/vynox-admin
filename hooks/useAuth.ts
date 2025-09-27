// hooks/useAuth.ts
import { login } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (resp) => {
      // persist token BEFORE redirect
      localStorage.setItem("token", resp.data?.token || "");
      toast.success("Login successful");
      router.push("/");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to login"),
  });
};
