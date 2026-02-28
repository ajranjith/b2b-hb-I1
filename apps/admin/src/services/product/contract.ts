// Product Type
export type ProductType = "Genuine" | "Aftermarket" | "Branded";

// Product Data (from TypeSense - for search)
export interface IProductData {
  id: string;
  code: string;
  name: string;
  type: string;
  stock: number;
  currency: string;
  net1: number;
  net2: number;
  net3: number;
  net4: number;
  net5: number;
  net6: number;
  net7: number;
  createdAt: number;
  updatedAt: number;
  supersededBy?: string;
  superseding?: IProductData | null;
}

// Product Data (from Admin API - Prisma)
export interface IProductAdminData {
  id: number;
  code: string;
  name: string;
  type: ProductType;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  image?: string | null;
  price: {
    net1: number;
    net2: number;
    net3: number;
    net4: number;
    net5: number;
    net6: number;
    net7: number;
    currency: string;
  } | null;
  stock: {
    stock: number;
  } | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

// Detailed Product Data (from database)
export interface IProductDetail {
  id: number;
  code: string;
  name: string;
  type: ProductType;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  image?: string | null;
  price: {
    net1: number;
    net2: number;
    net3: number;
    net4: number;
    net5: number;
    net6: number;
    net7: number;
    currency: string;
  } | null;
  stock: {
    stock: number;
  } | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

// List Products Query Params (TypeSense)
export interface IListProductsParams {
  page?: number;
  limit?: number;
  q?: string;
  type?: string;
}

// List Products Response (TypeSense)
export interface IListProductsResponse {
  success: true;
  data: IProductData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// List Products Admin Query Params (Prisma)
export interface IListProductsAdminParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ProductType;
}

// List Products Admin Response (Prisma)
export interface IListProductsAdminResponse {
  success: true;
  data: IProductAdminData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get Product Response
export interface IGetProductResponse {
  success: true;
  data: IProductDetail;
}

// Update Product Request
export interface IUpdateProductRequest {
  name?: string;
  type?: ProductType;
  stock?: number;
  net1?: number;
  net2?: number;
  net3?: number;
  net4?: number;
  net5?: number;
  net6?: number;
  net7?: number;
  image?: string | null;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

// Update Product Response
export interface IUpdateProductResponse {
  success: true;
  data: {
    id: number;
    code: string;
    name: string;
    type: string;
    updatedAt: string;
  };
}
