"use client";

import { useRef, useMemo } from "react";
import { ConfigProvider, App as AntApp } from "antd";
import { MutationCache } from "@tanstack/react-query";
import { QueryClient } from "@shared/lib/QueryClient";
import { initializeAxios } from "@shared/lib/AxiosClient";
import { getAllErrorMessages } from "@shared/utils/error";
import { theme } from "@/config/theme.config";
import { API_CONFIG, QUERY_CONFIG } from "@/config/app.config";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import NProgress from "nprogress";

initializeAxios(API_CONFIG);
NProgress.configure({ showSpinner: false });

function AppWithQueryClient({ children }: { children: React.ReactNode }) {
  const messageRef = useRef<ReturnType<typeof AntApp.useApp>["message"] | null>(null);
  const { message } = AntApp.useApp();
  messageRef.current = message;

  const queryConfigWithHandlers = useMemo(
    () => ({
      ...QUERY_CONFIG,
      mutationCache: new MutationCache({
        onError: (error) => {
          const messages = getAllErrorMessages(error);
          messages.forEach((msg) => messageRef.current?.error(msg));
        },
      }),
    }),
    []
  );

  return (
    <QueryClient config={queryConfigWithHandlers}>
      {children}
    </QueryClient>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ConfigProvider theme={theme()}>
        <AntApp>
          <AppWithQueryClient>{children}</AppWithQueryClient>
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
