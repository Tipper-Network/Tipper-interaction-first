"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./get-query-client";
import type * as React from "react";
import { useEffect, useState } from "react";
import { isDev } from "../utils/env_utils";

export default function QueryProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use state to ensure we only render after hydration
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = getQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDev() && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
