"use client";

import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./layout/Loading";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (pathname !== "/auth/login") router.replace("/auth/login");
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token");
          router.replace("/auth/login");
          setAuthorized(false);
        } else {
          if (pathname === "/auth/login") {
            router.replace("/");
          }
          setAuthorized(true);
        }
      } catch {
        localStorage.removeItem("token");
        router.replace("/auth/login");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) return <Loading />;

  // Only render children if authorized or already on /auth/login
  if (!authorized && pathname !== "/auth/login") return null;

  return <>{children}</>;
};

export default AuthGuard;
