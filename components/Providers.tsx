import { Toaster } from "sonner";
import { DashboardLayout } from "./layout/dashboard-layout";
import ReactQueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";

const Providers = async ({ children }: { children: React.ReactNode }) => {
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
