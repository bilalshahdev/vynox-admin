import AuthGuard from "@/components/AuthGuard";
import Providers from "@/components/Providers";
import ResponseError from "@/components/ResponseError";
import { baseUrl } from "@/config/constants";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "VynoxVPN Admin Dashboard",
  description: "Professional VPN management system for administrators",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let error: string | null = null;

  console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);


  if (!baseUrl) {
    error = "❌ No Base URL provided.";
  } else {
    try {
      const res = await fetch(`${baseUrl}/api/v1`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) {
          error = "❌ Invalid server URL";
        } else {
          error = `❌ Server responded with status ${res.status}`;
        }
      }
    } catch (e: any) {
      error = e.message || "❌ Could not connect to server";
    }
  }
  return (
    <html suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {error ? (
          <ResponseError className="h-screen" error={error} />
        ) : (
          <Providers>
            <AuthGuard>
              <main>{children}</main>
            </AuthGuard>
          </Providers>
        )}
      </body>
    </html>
  );
}
