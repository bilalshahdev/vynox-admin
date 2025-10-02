"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Dashboard", subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6 shadow-sm">
        <SidebarTrigger />
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
          >
            <Sun className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-sidebar px-6 shadow-sm">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
}
