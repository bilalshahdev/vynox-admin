import type React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className={`flex flex-1 flex-col overflow-hidden`}>
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
