import { createQueryKeys } from "@lukemorales/query-key-factory";
import { GET } from "@shared/lib/AxiosClient";
import type { IDispatchMethodsResponse, IDealerStatusesResponse } from "./contract";

export const masterQueries = createQueryKeys("master", {
  dispatchMethods: {
    queryKey: null,
    queryFn: () =>
      GET<IDispatchMethodsResponse>({
        url: "/master/dispatch_methods",
      }),
  },
  dealerStatuses: {
    queryKey: null,
    queryFn: () =>
      GET<IDealerStatusesResponse>({
        url: "/master/dealer_statuses",
      }),
  },
});
