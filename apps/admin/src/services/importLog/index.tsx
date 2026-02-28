import { useQuery } from "@tanstack/react-query";
import type {
  IListImportLogsParams,
  IListImportLogsResponse,
  IImportErrorsParams,
  IImportErrorsResponse,
  IImportStatsResponse,
  IProductImportResponse,
  IImportUploadResponse,
} from "./contract";
import { queries } from "../queryKeys";
import { GET, POST } from "@shared/lib/AxiosClient";

// List import logs query (GET /import)
export const useListImportLogs = (params: IListImportLogsParams = {}, options?: object) =>
  useQuery({
    ...queries.importLog.list(params),
    ...options,
  });

// Template type for POST /import/template body (all tabs)
export type ImportTemplateType =
  | "dealer"
  | "product"
  | "superseded"
  | "Backlog"
  | "overallStatus";

// POST /import/template – returns Excel blob for sample template
export async function fetchImportTemplate(
  type: ImportTemplateType
): Promise<Blob> {
  return POST<Blob>({
    url: "/import/template",
    data: { type },
    responseType: "blob",
  });
}

// Tab key -> upload endpoint (POST multipart/form-data with file)
const IMPORT_UPLOAD_ENDPOINTS: Record<string, string> = {
  products: "/import/products",
  dealers: "/import/dealers",
  superseded: "/import/superseded",
  backorder: "/import/backorders",
  "order-status": "/import/order-status",
};

export type ImportUploadResult =
  | { isProduct: true; data: IProductImportResponse }
  | { isProduct: false; data: IImportUploadResponse };

// POST /import/{type} – multipart form with file
export async function uploadImportFile(
  tabKey: string,
  file: File
): Promise<ImportUploadResult> {
  const url = IMPORT_UPLOAD_ENDPOINTS[tabKey];
  if (!url) throw new Error(`Unknown import tab: ${tabKey}`);

  const formData = new FormData();
  formData.append("file", file);

  const response = await POST<unknown>({
    url,
    data: formData,
  });

  const data = response as IProductImportResponse | IImportUploadResponse;

  const isProduct =
    "message" in data &&
    data.data &&
    typeof data.data === "object" &&
    "jobId" in data.data &&
    "statusUrl" in data.data;

  if (isProduct) {
    return { isProduct: true, data: data as IProductImportResponse };
  }
  return { isProduct: false, data: data as IImportUploadResponse };
}

// GET import/{importId}/stats
export async function fetchImportStats(importId: number): Promise<IImportStatsResponse> {
  return GET<IImportStatsResponse>({
    url: `/import/${importId}/stats`,
  });
}

// GET import/{importId}/errors
export async function fetchImportErrors(
  importId: number,
  params?: IImportErrorsParams
): Promise<IImportErrorsResponse> {
  return GET<IImportErrorsResponse>({
    url: `/import/${importId}/errors`,
    params,
  });
}

// GET import/{importId}/errors/export – returns Excel blob
export async function fetchImportErrorsExport(
  importId: number
): Promise<Blob> {
  return GET<Blob>({
    url: `/import/${importId}/errors/export`,
    responseType: "blob",
  });
}

// Re-export contracts and utils
export type {
  IImportErrorDetailItem,
  IImportErrorItem,
  IImportErrorsParams,
  IImportErrorsResponse,
  IImportLogData,
  IImportStatsData,
  IImportStatsResponse,
  IImportUploadData,
  IImportUploadResponse,
  IImportUser,
  IListImportLogsParams,
  IListImportLogsResponse,
  IProductImportData,
  IProductImportResponse,
  ImportSource,
  ImportStatus,
  ImportType,
} from "./contract";
export { getImportLogStatusTag } from "./statusUtils";
