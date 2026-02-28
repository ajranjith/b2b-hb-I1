import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { IListAdminsParams, IListAdminsResponse } from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const adminQueries = createQueryKeys("admin", {
  list: (params: IListAdminsParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListAdminsResponse>({
        url: "/user/admin",
        params,
      }),
  }),
});
