"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Sonner />
      </QueryClientProvider>
    </TooltipProvider>
  );
}
