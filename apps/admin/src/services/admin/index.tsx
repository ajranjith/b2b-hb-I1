import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PATCH, POST, PUT } from "@shared/lib/AxiosClient";
import type { UseMutationType } from "@shared/contracts/query";
import type {
  ICreateAdminRequest,
  ICreateAdminResponse,
  IListAdminsParams,
  IListAdminsResponse,
  IUpdateAdminRequest,
  IUpdateAdminResponse,
  IUpdateAdminStatusRequest,
  IUpdateAdminStatusResponse,
} from "./contract";
import { queries } from "../queryKeys";

// List Admins Query
export const useListAdmins = (params: IListAdminsParams = {}, options?: object) =>
  useQuery({
    ...queries.admin.list(params),
    ...options,
  });

// Create Admin Mutation
export const useCreateAdmin: UseMutationType<
  ICreateAdminResponse,
  ICreateAdminRequest
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      POST<ICreateAdminResponse>({
        url: "/user/admin",
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.admin.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update Admin Mutation
export const useUpdateAdmin: UseMutationType<
  IUpdateAdminResponse,
  { id: number; data: IUpdateAdminRequest }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      PUT<IUpdateAdminResponse>({
        url: `/user/admin-update/${id}`,
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.admin.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update Admin Status Mutation
export const useUpdateAdminStatus: UseMutationType<
  IUpdateAdminStatusResponse,
  { id: number; data: IUpdateAdminStatusRequest }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      PATCH<IUpdateAdminStatusResponse>({
        url: `/user/admin-status/${id}`,
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.admin.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Re-export contracts
export * from "./contract";
