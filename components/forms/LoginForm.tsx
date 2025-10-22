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
import { useEffect, useState } from "react";
import * as secureCrypto from "@/utils/secureCrypto";

interface LoginFormProps {
  email: string;
  password: string;
}

const STORAGE_KEY = "myapp_remember_credentials_v1";
const KEY_STORE = "myapp_remember_key_v1";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm = () => {
  const { control, handleSubmit, setValue } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const [remember, setRemember] = useState<boolean>(false);
  const [loadingRemembered, setLoadingRemembered] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const rawKey = localStorage.getItem(KEY_STORE);
        if (stored && rawKey) {
          // parse stored JSON
          const parsed = JSON.parse(stored) as {
            email: string;
            iv: string;
            cipher: string;
          };

          // import key and decrypt
          const key = await secureCrypto.importRawKey(rawKey);
          const pwd = await secureCrypto.decryptText(
            key,
            parsed.iv,
            parsed.cipher
          );

          if (!mounted) return;
          setValue("email", parsed.email);
          setValue("password", pwd);
          setRemember(true); // pre-check remember
        }
      } catch (err) {
        console.warn("Failed to load remembered credentials:", err);
      } finally {
        if (mounted) setLoadingRemembered(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setValue]);

  const onSubmit = async (data: LoginFormProps) => {
    if (remember) {
      try {
        let rawKey = localStorage.getItem(KEY_STORE);
        let key = rawKey
          ? await secureCrypto.importRawKey(rawKey)
          : await secureCrypto.generateAesKey();

        if (!rawKey) {
          rawKey = await secureCrypto.exportRawKey(key);
          localStorage.setItem(KEY_STORE, rawKey);
        }

        const { iv, cipher } = await secureCrypto.encryptText(
          key,
          data.password
        );
        const payload = {
          email: data.email,
          iv,
          cipher,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.error("Failed to store credentials:", err);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(KEY_STORE);
    }

    mutate(data, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Login with your email and password</CardDescription>
      </CardHeader>
      <CardContent>
        {loadingRemembered ? (
          <div className="py-8 text-center">Checking saved credentials...</div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="on"
          >
            <TextInput
              control={control}
              placeholder="Enter your email"
              name="email"
              type="email"
              autoComplete="email"
            />
            <PasswordInput
              control={control}
              placeholder="Enter your password"
              name="password"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded"
                />
                <span>Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isPending}
            >
              {isPending ? <Loader /> : "Login"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
