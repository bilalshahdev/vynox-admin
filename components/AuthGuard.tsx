"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <p className="text-lg font-semibold">Loading...</p>
  </div>
);

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

  if (loading) return <Loader />;

  // Only render children if authorized or already on /auth/login
  if (!authorized && pathname !== "/auth/login") return null;

  return <>{children}</>;
};

export default AuthGuard;
