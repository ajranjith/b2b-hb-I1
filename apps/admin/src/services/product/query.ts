import { createQueryKeys } from "@lukemorales/query-key-factory";
import type {
  IListProductsParams,
  IListProductsResponse,
  IListProductsAdminParams,
  IListProductsAdminResponse,
  IGetProductResponse
} from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const productQueries = createQueryKeys("product", {
  list: (params: IListProductsParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListProductsResponse>({
        url: "/products",
        params,
      }),
  }),
  adminList: (params: IListProductsAdminParams) => ({
    queryKey: ['admin', params],
    queryFn: () =>
      GET<IListProductsAdminResponse>({
        url: "/products/admin",
        params,
      }),
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () =>
      GET<IGetProductResponse>({
        url: `/products/${id}`,
      }),
  }),
});
