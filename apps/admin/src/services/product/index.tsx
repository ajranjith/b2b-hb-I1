import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PUT } from "@shared/lib/AxiosClient";
import type { UseMutationType } from "@shared/contracts/query";
import type {
  IListProductsParams,
  IListProductsResponse,
  IListProductsAdminParams,
  IListProductsAdminResponse,
  IGetProductResponse,
  IUpdateProductRequest,
  IUpdateProductResponse,
} from "./contract";
import { queries } from "../queryKeys";

// List Products Query (TypeSense)
export const useListProducts = (params: IListProductsParams = {}, options?: object) =>
  useQuery({
    ...queries.product.list(params),
    ...options,
  });

// List Products Admin Query (Prisma)
export const useListProductsAdmin = (params: IListProductsAdminParams = {}, options?: object) =>
  useQuery({
    ...queries.product.adminList(params),
    ...options,
  });

// Get Product Detail Query
export const useGetProduct = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    ...queries.product.detail(id),
    enabled: !!id,
    ...options,
  });

// Update Product Mutation
export const useUpdateProduct: UseMutationType<
  IUpdateProductResponse,
  { id: number; data: IUpdateProductRequest }
> = (options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      PUT<IUpdateProductResponse>({
        url: `/products/${id}`,
        data,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queries.product.list({}).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.product.adminList({}).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.product.detail(variables.id).queryKey,
      });
      // @ts-expect-error - Type mismatch between UseMutationType and actual onSuccess signature
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

// Re-export contracts
export * from "./contract";
