// Admin User Data
export interface IAdminData {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  status: boolean;
  createdAt: string;
  role: {
    code: string;
    name: string;
  };
}

// Create Admin Request
export interface ICreateAdminRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

// Create Admin Response
export interface ICreateAdminResponse {
  success: true;
  data: IAdminData;
}

// Update Admin Request
export interface IUpdateAdminRequest {
  firstName: string;
  lastName?: string;
  email: string;
}

// Update Admin Response
export interface IUpdateAdminResponse {
  success: true;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    updatedAt: string;
  };
}

// List Admins Query Params
export interface IListAdminsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

// List Admins Response
export interface IListAdminsResponse {
  success: true;
  data: IAdminData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Update Admin Status Request
export interface IUpdateAdminStatusRequest {
  status: boolean;
}

// Update Admin Status Response
export interface IUpdateAdminStatusResponse {
  success: true;
  data: IAdminData;
}
