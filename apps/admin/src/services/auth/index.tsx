import { useMutation, useQuery } from "@tanstack/react-query";

import type {
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
  IProfileResponse,
} from "./contract";
import { authQueries } from "./query";
import { GET, POST } from "../../../../../packages/shared/lib/AxiosClient";
import { UseMutationType } from "../../../../../packages/shared";

// Profile query
export const useProfile = (options?: object) =>
  useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () =>
      GET<IProfileResponse>({
        url: "/auth/profile",
      }),
    ...options,
  });

// Admin Login mutation
export const useLogin: UseMutationType<ILoginResponse, ILoginRequest> = (
  options
) =>
  useMutation({
    mutationFn: (data) =>
      POST<ILoginResponse>({
        url: "/auth/login/admin",
        data,
      }),
    ...options,
  });

// Logout mutation
export const useLogout: UseMutationType<ILogoutResponse, void> = (options) =>
  useMutation({
    mutationFn: () =>
      POST<ILogoutResponse>({
        url: "/auth/logout",
      }),
    ...options,
  });

// Re-export contracts
export * from "./contract";
