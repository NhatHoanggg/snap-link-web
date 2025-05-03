"use client";

import { Sidebar } from "./sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/services/auth";
// import { Navbar } from "./navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className={cn(
        "flex-1 overflow-y-auto p-8 transition-all duration-300",
        isCollapsed ? "ml-[10px]" : "ml-[30px]"
      )}>
        {children}
      </main>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <main className={cn(
        "flex-1 overflow-y-auto p-8 transition-all duration-300",
        isCollapsed ? "ml-[10px]" : "ml-[30px]"
      )}>
        {children}
      </main>
    </div>
  );
} 