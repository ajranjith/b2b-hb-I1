import { useQuery } from "@tanstack/react-query";
import type {
  IListOrdersParams,
  IListOrdersResponse,
  IListBackorderProductsParams,
  IListBackorderProductsResponse,
} from "./contract";
import { queries } from "../queryKeys";
import { GET } from "@shared/lib/AxiosClient";

// List Orders Query
export const useListOrders = (params: IListOrdersParams = {}, options?: object) =>
  useQuery({
    ...queries.order.list(params),
    ...options,
  });

// Export orders as Excel (returns blob for download)
export async function exportOrders(
  params?: Pick<IListOrdersParams, "search" | "status" | "type" | "startDate" | "endDate">
): Promise<Blob> {
  return GET<Blob>({
    url: "/orders/export",
    responseType: "blob",
    params,
  });
}

// List Backorder Products Query
export const useListBackorderProducts = (params: IListBackorderProductsParams = {}, options?: object) =>
  useQuery({
    ...queries.order.backorderProducts(params),
    ...options,
  });

// Export backorder products as Excel
export async function exportBackorderProducts(
  params?: Pick<IListBackorderProductsParams, "search">
): Promise<Blob> {
  return GET<Blob>({
    url: "/orders/backorders/products/export",
    responseType: "blob",
    params,
  });
}

// Export individual order as Excel
export async function exportOrder(orderId: number): Promise<Blob> {
  return GET<Blob>({
    url: `/orders/${orderId}/export`,
    responseType: "blob",
  });
}

// Re-export contracts
export * from "./contract";
