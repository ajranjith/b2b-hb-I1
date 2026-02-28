import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  IListExternalLinksParams,
  ICreateExternalLinkBody,
  IUpdateExternalLinkBody,
  IExternalLinkResponse,
  IDeleteExternalLinkResponse,
  IListBannersParams,
  ICreateBannerBody,
  IUpdateBannerBody,
  IBannerResponse,
  IDeleteBannerResponse,
  IListNewsOffersParams,
  ICreateNewsOfferBody,
  IUpdateNewsOfferBody,
  INewsOfferResponse,
  IDeleteNewsOfferResponse,
  IAzureUploadResponse,
  ICreateExclusivePartBody,
  IUpdateExclusivePartBody,
  IExclusivePartResponse,
  IDeleteExclusivePartResponse,
  IListExclusivePartsResponse,
  IListMarqueeParams,
  ICreateMarqueeBody,
  IUpdateMarqueeBody,
  IMarqueeResponse,
} from "./contract";
import { GET, POST, PUT, DELETE } from "@shared/lib/AxiosClient";
import { queries } from "../queryKeys";

const EXTERNAL_LINKS_BASE_KEY = ["cms", "externalLinks"] as const;
const BANNERS_BASE_KEY = ["cms", "banners"] as const;
const NEWS_OFFERS_BASE_KEY = ["cms", "newsOffers"] as const;
const EXCLUSIVE_PARTS_BASE_KEY = ["cms", "exclusiveParts"] as const;
const MARQUEE_BASE_KEY = ["cms", "marquee"] as const;

// List external links (paginated)
export function useListExternalLinks(
  params: IListExternalLinksParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...queries.cms.externalLinks(params),
    ...options,
  });
}

// Create external link
export function useCreateExternalLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICreateExternalLinkBody) =>
      POST<IExternalLinkResponse>({
        url: "/cms/external-links",
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXTERNAL_LINKS_BASE_KEY });
    },
  });
}

// Update external link
export function useUpdateExternalLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateExternalLinkBody }) =>
      PUT<IExternalLinkResponse>({
        url: `/cms/external-links/${id}`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXTERNAL_LINKS_BASE_KEY });
    },
  });
}

// Delete external link
export function useDeleteExternalLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      DELETE<IDeleteExternalLinkResponse>({
        url: `/cms/external-links/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXTERNAL_LINKS_BASE_KEY });
    },
  });
}

// Upload file to Azure (image/pdf) – returns URL to use in CMS image fields
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await POST<IAzureUploadResponse>({
    url: "/azure/upload",
    data: formData,
  });

  if (!data?.success || !data?.data?.length) {
    throw new Error("Upload failed or no URL returned");
  }
  return data.data[0].url;
}

// List banners (paginated)
export function useListBanners(
  params: IListBannersParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...queries.cms.banners(params),
    ...options,
  });
}

// Create banner
export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICreateBannerBody) =>
      POST<IBannerResponse>({
        url: "/cms/banner",
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_BASE_KEY });
    },
  });
}

// Update banner
export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateBannerBody }) =>
      PUT<IBannerResponse>({
        url: `/cms/banner/${id}`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_BASE_KEY });
    },
  });
}

// Delete banner
export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      DELETE<IDeleteBannerResponse>({
        url: `/cms/banner/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNERS_BASE_KEY });
    },
  });
}

// List news & offers (paginated, optional type filter)
export function useListNewsOffers(
  params: IListNewsOffersParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...queries.cms.newsOffers(params),
    ...options,
  });
}

// Get news/offer by id
export function useGetNewsOfferById(id: number) {
  return useQuery({
    ...queries.cms.newsOffersById(id),
  });
}

// Create news/offer
export function useCreateNewsOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICreateNewsOfferBody) =>
      POST<INewsOfferResponse>({
        url: "/cms/news-offers",
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_OFFERS_BASE_KEY });
    },
  });
}

// Update news/offer
export function useUpdateNewsOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateNewsOfferBody }) =>
      PUT<INewsOfferResponse>({
        url: `/cms/news-offers/${id}`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_OFFERS_BASE_KEY });
    },
  });
}

// Delete news/offer
export function useDeleteNewsOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      DELETE<IDeleteNewsOfferResponse>({
        url: `/cms/news-offers/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_OFFERS_BASE_KEY });
    },
  });
}

// List exclusive parts (returns single active part)
export function useListExclusiveParts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: EXCLUSIVE_PARTS_BASE_KEY,
    queryFn: () =>
      GET<IListExclusivePartsResponse>({
        url: "/cms/exclusive-parts",
      }),
    ...options,
  });
}

// Create exclusive part
export function useCreateExclusivePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICreateExclusivePartBody) =>
      POST<IExclusivePartResponse>({
        url: "/cms/exclusive-parts",
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXCLUSIVE_PARTS_BASE_KEY });
    },
  });
}

// Update exclusive part
export function useUpdateExclusivePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateExclusivePartBody }) =>
      PUT<IExclusivePartResponse>({
        url: `/cms/exclusive-parts/${id}`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXCLUSIVE_PARTS_BASE_KEY });
    },
  });
}

// Delete exclusive part
export function useDeleteExclusivePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      DELETE<IDeleteExclusivePartResponse>({
        url: `/cms/exclusive-parts/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXCLUSIVE_PARTS_BASE_KEY });
    },
  });
}

// List marquee (paginated)
export function useListMarquee( 
  params: IListMarqueeParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...queries.cms.marquee(params),
    ...options,
  });
}

// Create marquee
export function useCreateMarquee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ICreateMarqueeBody) =>
      POST<IMarqueeResponse>({
        url: "/cms/marquee",
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARQUEE_BASE_KEY });
    },
  });
}

// Update marquee
export function useUpdateMarquee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateMarqueeBody }) =>
      PUT<IMarqueeResponse>({
        url: `/cms/marquee/${id}`,
        data: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARQUEE_BASE_KEY });
    },
  });
}

export * from "./contract";
