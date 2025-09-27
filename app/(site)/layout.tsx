import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarProvider } from "@/components/ui/sidebar";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  );
};

export default SiteLayout;
