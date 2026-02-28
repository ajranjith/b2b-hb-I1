// Order Status
export type OrderStatus =
  | "CREATED"
  | "BACKORDER"
  | "READY_FOR_SHIPMENT"
  | "FULLFILLED"
  | "CANCELLED"
  | "PROCESSING";

// Order Type Filter
export type OrderType = "all" | "recent";

// Shipping Method
export interface IShippingMethod {
  id: number;
  name: string;
}

// Billing Information
export interface IBillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string | null;
}

// User Information (for admin view)
export interface IUserInfo {
  id: number;
  name: string;
  email: string;
}

// Order line item (when API returns full order details)
export interface IOrderItem {
  id: number;
  productCode?: string;
  productName?: string;
  quantity: number;
  formattedSubtotal?: string;
  product?: { code: string; name: string };
}

// Order Data
export interface IOrderData {
  id: number;
  orderNumber: string;
  billingOrderNo: string | null;
  orderDate: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  formattedTotal: string;
  currency: string;
  itemCount: number;
  totalQuantity: number;
  shippingMethod: IShippingMethod | null;
  billing: IBillingInfo;
  user?: IUserInfo;
  items?: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

// List Orders Query Params
export interface IListOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  type?: OrderType;
  startDate?: string;
  endDate?: string;
}

// List Orders Response
export interface IListOrdersResponse {
  success: true;
  data: IOrderData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Backorder Product
export interface IBackorderProduct {
  id: number;
  billingOrderNo: string;
  orderNumber: string;
  itemNumber: number;
  orderDate: string;
  productCode: string;
  productName: string;
  qtyOrdered: number;
  inWarehouse: number;
  qtyOutstanding: number;
}

// List Backorder Products Params
export interface IListBackorderProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// List Backorder Products Response
export interface IListBackorderProductsResponse {
  success: true;
  data: IBackorderProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
