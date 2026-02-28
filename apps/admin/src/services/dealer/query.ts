import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { IListDealersParams, IListDealersResponse } from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const dealerQueries = createQueryKeys("dealer", {
  list: (params: IListDealersParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListDealersResponse>({
        url: "/user/dealer",
        params,
      }),
  }),
});
