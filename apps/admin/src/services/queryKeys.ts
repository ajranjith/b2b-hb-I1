import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { authQueries } from "./auth/query";
import { dealerQueries } from "./dealer/query";
import { adminQueries } from "./admin/query";
import { productQueries } from "./product/query";
import { orderQueries } from "./order/query";
import { importLogQueries } from "./importLog/query";
import { masterQueries } from "./master/query";
import { cmsQueries } from "./cms/query";

export const queries = mergeQueryKeys(
  authQueries,
  dealerQueries,
  adminQueries,
  productQueries,
  orderQueries,
  importLogQueries,
  masterQueries,
  cmsQueries
);
