// Shipping Method
export interface IShippingMethod {
  id: number;
  name: string;
}

// Dispatch Methods Response
export interface IDispatchMethodsResponse {
  success: true;
  data: IShippingMethod[];
}

// Dealer Status
export interface IDealerStatus {
  code: string;
  name: string;
}

// Dealer Statuses Response
export interface IDealerStatusesResponse {
  success: true;
  data: IDealerStatus[];
}
