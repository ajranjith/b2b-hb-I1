import type { IShippingMethod } from "../master";

// Dealer Tiers
export type DealerTier =
  | "Net1"
  | "Net2"
  | "Net3"
  | "Net4"
  | "Net5"
  | "Net6"
  | "Net7";

// Dealer Account Status
export type DealerAccountStatus = "Active" | "Inactive" | "Suspended";

// Create Dealer Request
export interface ICreateDealerRequest {
  firstName: string;
  lastName?: string;
  email: string;
  accountNumber: number;
  companyName: string;
  genuinePartsTier: DealerTier;
  aftermarketESTier: DealerTier;
  aftermarketBTier: DealerTier;
  defaultShippingMethod?: number;
  notes?: string;
  accountStatus?: DealerAccountStatus;
}

// Dealer Data
export interface IDealerData {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: string;
  isLocked: boolean;
  dealer: {
    accountNumber: number;
    companyName: string;
    genuinePartsTier: DealerTier;
    aftermarketESTier: DealerTier;
    aftermarketBTier: DealerTier;
    defaultShippingMethod?: IShippingMethod;
    defaultShippingMethodId?: number;
    accountStatus: DealerAccountStatus;
  };
}

// Create Dealer Response
export interface ICreateDealerResponse {
  success: true;
  data: IDealerData;
}

// Update Dealer Request (same shape as create)
export type IUpdateDealerRequest = ICreateDealerRequest;

// Update Dealer Response
export interface IUpdateDealerResponse {
  success: true;
  data: IDealerData;
}

// List Dealers Query Params
export interface IListDealersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: DealerAccountStatus;
}

// List Dealers Response
export interface IListDealersResponse {
  success: true;
  data: IDealerData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Update Dealer Status Request
export interface IUpdateDealerStatusRequest {
  accountStatus: DealerAccountStatus;
}

// Update Dealer Status Response
export interface IUpdateDealerStatusResponse {
  success: true;
  data: IDealerData;
}

// Reset Dealer Password Response
export interface IResetDealerPasswordResponse {
  success: true;
  message: string;
  data: {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
  };
}

// Unlock Dealer Response
export interface IUnlockDealerResponse {
  success: true;
  data: {
    message: string;
  };
}
