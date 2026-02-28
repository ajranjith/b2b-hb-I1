import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PATCH, POST, PUT } from "@shared/lib/AxiosClient";
import type { UseMutationType } from "@shared/contracts/query";
import type {
  ICreateDealerRequest,
  ICreateDealerResponse,
  IListDealersParams,
  IListDealersResponse,
  IUpdateDealerRequest,
  IUpdateDealerResponse,
  IUpdateDealerStatusRequest,
  IUpdateDealerStatusResponse,
  IResetDealerPasswordResponse,
  IUnlockDealerResponse,
} from "./contract";
import { queries } from "../queryKeys";

// List Dealers Query
export const useListDealers = (params: IListDealersParams = {}, options?: object) =>
  useQuery({
    ...queries.dealer.list(params),
    ...options,
  });

// Create Dealer Mutation
export const useCreateDealer: UseMutationType<
  ICreateDealerResponse,
  ICreateDealerRequest
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      POST<ICreateDealerResponse>({
        url: "/user/dealer",
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.dealer.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update Dealer Mutation
export const useUpdateDealer: UseMutationType<
  IUpdateDealerResponse,
  { id: number; data: IUpdateDealerRequest }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      PUT<IUpdateDealerResponse>({
        url: `/user/dealer-update-admin/${id}`,
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.dealer.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Update Dealer Status Mutation
export const useUpdateDealerStatus: UseMutationType<
  IUpdateDealerStatusResponse,
  { id: number; data: IUpdateDealerStatusRequest }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      PATCH<IUpdateDealerStatusResponse>({
        url: `/user/dealer-status/${id}`,
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.dealer.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Reset Dealer Password Mutation
export const useResetDealerPassword: UseMutationType<
  IResetDealerPasswordResponse,
  { id: number }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) =>
      POST<IResetDealerPasswordResponse>({
        url: `/user/dealer-reset-password/${id}`,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.dealer.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Unlock Dealer Mutation
export const useUnlockDealer: UseMutationType<
  IUnlockDealerResponse,
  { id: number }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) =>
      PATCH<IUnlockDealerResponse>({
        url: `/user/dealer-unlock/${id}`,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.dealer.list({}).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Re-export contracts
export * from "./contract";
