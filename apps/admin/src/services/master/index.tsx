import { useQuery } from "@tanstack/react-query";
import type { IDispatchMethodsResponse, IDealerStatusesResponse } from "./contract";
import { queries } from "../queryKeys";

// Get dispatch methods (shipping methods)
export const useDispatchMethods = (options?: object) =>
  useQuery({
    ...queries.master.dispatchMethods,
    ...options,
  });

// Get dealer statuses
export const useDealerStatuses = (options?: object) =>
  useQuery({
    ...queries.master.dealerStatuses,
    ...options,
  });

// Re-export contracts
export * from "./contract";
