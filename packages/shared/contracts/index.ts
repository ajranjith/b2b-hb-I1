export interface IPaginatedRes<T> {
  data: T[];
  totalCount: number;
  totalPage: number;
  pageSize: number;
  currentPage: number;
}

export interface ITimestampEntity {
  _id: string;
  status: boolean;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IErrorResponse {
  success: false;
  errors: string[];
  code: string;
  fields?: Record<string, string[]>;
  stack?: string;
}

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IPaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
