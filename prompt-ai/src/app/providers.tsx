"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AutoRefreshProvider from "@/components/AutoRefreshProvider";
import { UserProvider } from "@/context/userContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <AutoRefreshProvider>
          <UserProvider>{children}</UserProvider>
          <Sonner />
        </AutoRefreshProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}
