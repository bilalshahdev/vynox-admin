import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";
import { baseUrl } from "@/config/constants";
import ReactQueryProvider from "@/components/query-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Toaster } from "sonner";

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
  let isServerConnected = false;

  if (!baseUrl) {
    error = "❌ No Base URL provided.";
  } else {
    try {
      const res = await fetch(baseUrl, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) {
          error = "❌ Invalid server URL";
        } else {
          error = `❌ Server responded with status ${res.status}`;
        }
      } else {
        isServerConnected = true;
      }
    } catch (e) {
      error = "❌ Could not connect to server";
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              storageKey="vynox-theme"
            >
              <Toaster />
              <DashboardLayout>{children}</DashboardLayout>
            </ThemeProvider>
          </ReactQueryProvider>{" "}
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
