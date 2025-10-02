"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "../Loader";
import { Button } from "../ui/button";
import PasswordInput from "./fields/PasswordInput";
import TextInput from "./fields/TextInput";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface LoginFormProps {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginFormProps) => {
    mutate(data, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Login with your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            control={control}
            placeholder="Enter your email"
            name="email"
            type="email"
          />
          <PasswordInput
            control={control}
            placeholder="Enter your password"
            name="password"
          />
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isPending}
          >
            {isPending ? <Loader /> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
