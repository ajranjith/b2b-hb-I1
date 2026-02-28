import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { IListImportLogsParams, IListImportLogsResponse } from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const importLogQueries = createQueryKeys("importLog", {
  list: (params: IListImportLogsParams) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListImportLogsResponse>({
        url: "/import",
        params,
      }),
  }),
});
