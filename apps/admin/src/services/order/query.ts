import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { IListOrdersParams, IListOrdersResponse, IListBackorderProductsParams, IListBackorderProductsResponse } from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const orderQueries = createQueryKeys("order", {
  list: (params: IListOrdersParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListOrdersResponse>({
        url: "/orders",
        params,
      }),
  }),
  backorderProducts: (params: IListBackorderProductsParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListBackorderProductsResponse>({
        url: "/orders/backorders/products",
        params,
      }),
  }),
});
