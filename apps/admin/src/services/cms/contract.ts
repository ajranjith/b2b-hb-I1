// Pagination meta (for list responses)
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// External link item (API shape)
export interface IExternalLinkItem {
  id: number;
  image: string;
  title: string;
  link: string;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

// List external links params
export interface IListExternalLinksParams {
  page?: number;
  limit?: number;
}

// List external links response
export interface IListExternalLinksResponse {
  success: true;
  data: IExternalLinkItem[];
  meta?: IPaginationMeta;
}

// Create external link body
export interface ICreateExternalLinkBody {
  image: string;
  title: string;
  link: string;
}

// Update external link body
export interface IUpdateExternalLinkBody {
  image: string;
  title: string;
  link: string;
  orderNo: number;
  status: boolean;
}

// Single external link response (create/update)
export interface IExternalLinkResponse {
  success: true;
  data: IExternalLinkItem;
}

// Delete response
export interface IDeleteExternalLinkResponse {
  success: true;
  message: string;
}

// Azure upload response
export interface IAzureUploadFileItem {
  url: string;
  fileName: string;
  fileSize: number;
}

export interface IAzureUploadResponse {
  success: true;
  data: IAzureUploadFileItem[];
}

// Banner type – API uses "Horizontal" | "Vertical"
export type BannerType = "Horizontal" | "Vertical";

// Banner item (API shape – uses "imgae" per API)
export interface IBannerItem {
  id: number;
  type: BannerType;
  title: string;
  description: string;
  imgae: string;
  link?: string | null;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

// List banners params
export interface IListBannersParams {
  page?: number;
  limit?: number;
  type?: BannerType;
}

export interface IListBannersResponse {
  success: true;
  data: IBannerItem[];
  meta?: IPaginationMeta;
}

export interface ICreateBannerBody {
  type: BannerType;
  title: string;
  description: string;
  imgae: string;
  link?: string;
  orderNo: number;
}

export interface IUpdateBannerBody {
  type?: BannerType;
  title: string;
  description: string;
  imgae: string;
  link?: string;
  orderNo: number;
  status: boolean;
}

export interface IBannerResponse {
  success: true;
  data: IBannerItem;
}

export interface IDeleteBannerResponse {
  success: true;
  message: string;
}

// News & Offers – API uses "News" | "Offers"
export type NewsOfferTypeApi = "News" | "Offers" | "PriceList";

export interface INewsOfferItem {
  id: number;
  type: NewsOfferTypeApi;
  title: string;
  description: string | null;
  longDescription: string | null;
  thumbnail: string;
  fileUpload: string | null;
  subtext: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface IListNewsOffersParams {
  page?: number;
  limit?: number;
  type?: NewsOfferTypeApi;
  filterType?: 'admin' | 'dealer';
}

export interface IListNewsOffersResponse {
  success: true;
  data: INewsOfferItem[];
  meta?: IPaginationMeta;
}

export interface ICreateNewsOfferBody {
  type: NewsOfferTypeApi;
  title: string;
  description?: string;
  longDescription?: string;
  thumbnail: string;
  fileUpload?: string;
  subtext?: string;
  fromDate: string;
  toDate?: string;
}

export interface IUpdateNewsOfferBody {
  type?: NewsOfferTypeApi;
  title?: string;
  description?: string;
  longDescription?: string;
  thumbnail?: string;
  fileUpload?: string;
  subtext?: string;
  fromDate?: string;
  toDate?: string;
  orderNo?: number;
  status?: boolean;
}

export interface INewsOfferResponse {
  success: true;
  data: INewsOfferItem;
}

export interface IDeleteNewsOfferResponse {
  success: true;
  message: string;
}

// Exclusive Parts
export interface IExclusivePartItem {
  id: number;
  title: string;
  description: string;
  imgae: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface IListExclusivePartsResponse {
  success: true;
  data: IExclusivePartItem | null;
}

export interface ICreateExclusivePartBody {
  title?: string;
  description?: string;
  imgae: string;
}

export interface IUpdateExclusivePartBody {
  title?: string;
  description?: string;
  imgae?: string;
  status?: boolean;
}

export interface IExclusivePartResponse {
  success: true;
  data: IExclusivePartItem;
}

export interface IDeleteExclusivePartResponse {
  success: true;
  message: string;
}

// Marquee
export interface IMarqueeItem {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface IListMarqueeParams {
  page?: number;
  limit?: number;
}

export interface IListMarqueeResponse {
  success: true;
  data: IMarqueeItem[];
  meta?: IPaginationMeta;
}

export interface ICreateMarqueeBody {
  text: string;
  status: boolean;
}

export interface IUpdateMarqueeBody {
  text: string;
  status: boolean;
}

export interface IMarqueeResponse {
  success: true;
  data: IMarqueeItem;
}
