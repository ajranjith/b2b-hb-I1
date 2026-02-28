import { createQueryKeys } from "@lukemorales/query-key-factory";
import type {
  IListExternalLinksResponse,
  IListExternalLinksParams,
  IListBannersResponse,
  IListBannersParams,
  IListNewsOffersResponse,
  IListNewsOffersParams,
  IListMarqueeResponse,
  IListMarqueeParams,
  INewsOfferResponse,
  INewsOfferItem,
} from "./contract";
import { GET } from "@shared/lib/AxiosClient";

export const cmsQueries = createQueryKeys("cms", {
  externalLinks: (params: IListExternalLinksParams = {}) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListExternalLinksResponse>({
        url: "/cms/external-links",
        params: { page: params.page, limit: params.limit },
      }),
  }),
  banners: (params: IListBannersParams = {}) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListBannersResponse>({
        url: "/cms/banner",
        params: { page: params.page, limit: params.limit, type: params.type },
      }),
  }),
  newsOffers: (params: IListNewsOffersParams = {}) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListNewsOffersResponse>({
        url: "/cms/news-offers",
        params: { page: params.page, limit: params.limit, type: params.type },
      }),
  }),
  newsOffersById:(id:number)=>({
    queryKey:[id],
    queryFn:()=>
      GET<INewsOfferItem>({
        url: `/cms/news-offers/${id}`,
      }),
  }),
  marquee: (params: IListMarqueeParams = {}) => ({
    queryKey: [params],
    queryFn: () =>
      GET<IListMarqueeResponse>({
        url: "/cms/marquee",
        params: { page: params.page, limit: params.limit },
      }),
  }),
});
