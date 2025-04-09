"use client";

import { Sidebar } from "./sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <main className={cn(
        "flex-1 overflow-y-auto p-8 transition-all duration-300",
        isCollapsed ? "ml-[80px]" : "ml-[240px]"
      )}>
        {children}
      </main>
    </div>
  );
} 