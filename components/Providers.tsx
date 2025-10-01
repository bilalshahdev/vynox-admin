"use client";
import { Toaster } from "sonner";
import ReactQueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ReactQueryProvider>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="vynox-theme"
        >
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    </div>
  );
};

export default Providers;
