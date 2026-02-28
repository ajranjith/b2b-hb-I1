import type { QueryClientConfig } from "@tanstack/react-query";

export const ENV = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:3000/api/v1",
  WEB_DOMAIN: process.env.NEXT_PUBLIC_WEB_DOMAIN || "",
};

export const API_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: 5 * 60 * 1000,
};

export const QUERY_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000,
      retry: (_, error: unknown) => {
        const statusCode = (error as { response?: { status?: number } })
          ?.response?.status;
        const excludeStatus = [401, 404, 403, 500];
        return !excludeStatus.includes(Number(statusCode));
      },
    },
    mutations: {
      retry: false,
    },
  },
};
