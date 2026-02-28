export type ImportType =
  | "PARTS"
  | "DEALERS"
  | "SUPERSEDED"
  | "BACKORDER"
  | "ORDER_STATUS";

export type ImportStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type ImportSource = "MANUAL" | "SHAREPOINT";

export interface IImportUser {
  id: number;
  name: string;
  email: string;
}

export interface IImportErrorItem {
  id: number;
  rowNumber: number;
  rowData: unknown;
  errors: string[];
  createdAt: string;
}

export interface IImportLogData {
  id: number;
  type: ImportType;
  importStatus: ImportStatus;
  importSource: ImportSource;
  fileName: string;
  fileSize: number;
  fileUrl: string | null;
  sharePointFileId: string | null;
  sharePointFileModifiedDate: string | null;
  totalRows: number;
  successCount: number;
  errorCount: number;
  importedBy: IImportUser | null;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  createdAt: string;
  updatedAt: string;
  errors: IImportErrorItem[];
}

export interface IListImportLogsParams {
  page?: number;
  limit?: number;
  status?: ImportStatus;
  type?: ImportType;
}

export interface IListImportLogsResponse {
  success: true;
  data: IImportLogData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IImportUploadData {
  importLogId: number;
  totalRows: number;
  successCount: number;
  errorCount: number;
  durationMs: number;
  errors: Array<{ row: number; data: unknown; errors: string[] }>;
}

export interface IImportUploadResponse {
  success: true;
  data: IImportUploadData;
}

export interface IProductImportData {
  jobId: number;
  totalRows: number;
  statusUrl: string;
}

export interface IProductImportResponse {
  success: true;
  message: string;
  data: IProductImportData;
}

export interface IImportStatsData {
  totalRows: number;
  successCount: number;
  errorCount: number;
}

export interface IImportStatsResponse {
  success: true;
  data: IImportStatsData;
}

export interface IImportErrorDetailItem {
  id: number;
  rowNumber: number;
  rowData: unknown;
  errors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IImportErrorsParams {
  page?: number;
  limit?: number;
}

export interface IImportErrorsResponse {
  success: true;
  data: IImportErrorDetailItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
