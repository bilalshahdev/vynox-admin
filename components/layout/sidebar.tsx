"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Power } from "lucide-react";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import navigation from "@/config/navigation";
import ConfirmDialog from "../ConfirmDialog";
import Brand from "./Brand";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isMenuActive = (path: { href: string }) => {
    return pathname === path.href;
  };

  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
      if (isMobile && openMobile && !isLogoutDialogOpen) {
        setOpenMobile(false);
      }
    }
  }, [
    pathname,
    currentPath,
    isMobile,
    openMobile,
    setOpenMobile,
    isLogoutDialogOpen,
  ]);

  const handleConfirm = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };
  return (
    <SidebarComponent
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border shadow-sm  h-full",
        className
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-16 px-3 border-b flex items-center justify-center">
        <SidebarMenuButton className="cursor-pointer h-full hover:bg-transparent">
          <Brand />
          <span className="text-xl font-bold text-signature tracking-tight">
            VynoxVPN
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between py-4">
        <SidebarGroup className="overflow-y-auto">
          <SidebarMenu className="flex flex-col">
            {navigation.map(
              (item: { href: string; name: string; icon: any }) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    isActive={isMenuActive(item)}
                    asChild
                    className={
                      isMenuActive(item)
                        ? "bg-gradient-to-b from-blue-500/20 to-aqua/20"
                        : "hover:bg-gradient-to-b/50 from-blue-500/20 to-aqua/20"
                    }
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon size={20} className="text-foreground/50" />

                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter>
          <ConfirmDialog
            title="Logout"
            description="Are you sure you want to logout?"
            onConfirm={() => handleConfirm()}
            variant="destructive"
            asChild
          >
            <SidebarMenuButton className="bg-red-500 hover:bg-red-600 hover:text-white text-white transition-colors">
              <Power size={16} /> <span>Logout</span>
            </SidebarMenuButton>
          </ConfirmDialog>
        </SidebarFooter>
      </SidebarContent>
    </SidebarComponent>
  );
}
