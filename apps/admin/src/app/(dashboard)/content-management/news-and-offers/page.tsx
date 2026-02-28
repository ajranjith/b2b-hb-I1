"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Tabs, Select, Pagination, App, Spin, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddNewsOfferDrawer, {
  type NewsOfferItem,
  type NewsOfferType,
} from "@/components/content-management/AddNewsOfferDrawer";
import {
  useListNewsOffers,
  useCreateNewsOffer,
  useUpdateNewsOffer,
  useDeleteNewsOffer,
} from "@/services/cms";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

function mapApiToItem(api: {
  id: number;
  type: "News" | "Offers" | "PriceList";
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
}): NewsOfferItem {
  return {
    id: api.id,
    type: api.type,
    title: api.title,
    description: api.description,
    longDescription: api.longDescription,
    thumbnail: api.thumbnail,
    fileUpload: api.fileUpload,
    subtext: api.subtext,
    fromDate: api.fromDate,
    toDate: api.toDate,
    orderNo: api.orderNo,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    status: api.status,
  };
}

const formatDate = (iso: string) => dayjs(iso).format("DD-MM-YYYY");

const VALID_TABS: NewsOfferType[] = ["news", "offers", "pricelist"];

export default function NewsAndOffersPage() {
  const { modal } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsOfferItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const rawTab = searchParams.get("tab") as NewsOfferType | null;
  const activeTab: NewsOfferType = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "news";

  const typeParam =
    activeTab === "news"
      ? "News"
      : activeTab === "offers"
        ? "Offers"
        : "PriceList";
  const { data, isLoading, isError } = useListNewsOffers(
    {
      page: currentPage,
      limit: pageSize,
      type: typeParam,
      filterType: "admin",
    }
  );

  const createMutation = useCreateNewsOffer();
  const updateMutation = useUpdateNewsOffer();
  const deleteMutation = useDeleteNewsOffer();

  const items: NewsOfferItem[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiToItem);
  }, [data]);

  const meta = data?.meta;
  const totalRecords = meta?.total ?? data?.data?.length ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const handleAddNew = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleEdit = (record: NewsOfferItem) => {
    setEditingItem(record);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (values: {
    type: "News" | "Offers" | "PriceList";
    title: string;
    description: string;
    longDescription: string;
    thumbnailUrl: string;
    fileUploadUrl: string;
    subtext: string;
    fromDate: string;
    toDate?: string;
  }) => {
    if (editingItem) {

      console.log("---AAAA", values.longDescription)
      updateMutation.mutate(
        {
          id: editingItem.id,
          body: {
            type: values.type,
            title: values.title,
            description: values.description || undefined,
            longDescription: values.longDescription,
            thumbnail: values.thumbnailUrl,
            fileUpload: values.fileUploadUrl || undefined,
            subtext: values.subtext || undefined,
            fromDate: values.fromDate,
            toDate: values.toDate,
            orderNo: editingItem.orderNo ?? 0,
            status: editingItem.status,
          },
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to update news & offers");
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          type: values.type,
          title: values.title,
          description: values.description || undefined,
          longDescription: values.longDescription,
          thumbnail: values.thumbnailUrl,
          fileUpload: values.fileUploadUrl || undefined,
          subtext: values.subtext || undefined,
          fromDate: values.fromDate,
          toDate: values.toDate,
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to create news & offers");
          },
        }
      );
    }
  };

  const handleDelete = (record: NewsOfferItem) => {
    setDrawerOpen(false);
    modal.confirm({
      title: "Delete item",
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteMutation.mutateAsync(record.id);
        setEditingItem(null);
      },
    });
  };

  if (isError) {
    return (
      <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
        <p className="text-red-500">Failed to load news & offers.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-150px)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">News & Offers & PriceList</h1>
          <p className="text-gray-500 mt-1">
            View, manage, and maintain contents that can be displayed in the main portal.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="shrink-0 h-[42px]! min-w-[120px] rounded-[33px]!"
        >
          Add New
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("tab", k);
          router.replace(`?${params.toString()}`);
          setCurrentPage(1);
        }}
        className="news-offers-tabs h-[52px]! mb-5.5!"
        items={[
          { key: "news", label: "News" },
          { key: "offers", label: "Offers" },
          { key: "pricelist", label: "PriceList" },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p>No {activeTab} yet. Add your first item to get started.</p>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#E2E2E2] rounded-[8px] px-2.5 py-3.5 h-[120px] hover:shadow-sm transition-shadow"
                >
                  <li className="flex items-center gap-4">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-[94px] h-[94px] rounded-[8px] object-cover"
                      />
                    ) : (
                      <div className="w-[94px] h-[94px] rounded-[8px] bg-[#EEF2F8] flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-lg">{item.title}</p>
                        {item.subtext && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {item.subtext}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-[#6A6A6A] mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.fileUpload && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={item.fileUpload}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={item.fileUpload}
                          className="text-xs text-primary! hover:underline! mt-1 inline-block"
                        >
                          Download file
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col justify-between items-end h-[94px]">
                      <span className="text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          danger
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-2">
              <Select
                value={pageSize}
                onChange={(v) => {
                  setPageSize(v);
                  setCurrentPage(1);
                }}
                options={PAGE_SIZE_OPTIONS.map((n) => ({
                  label: String(n),
                  value: n,
                }))}
                className="w-[100px]"
              />
              <span className="text-sm text-gray-600">
                Showing {startRecord} - {endRecord} Of {totalRecords} records
              </span>
            </div>
            <Pagination
              current={currentPage}
              total={totalRecords}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
              showLessItems
            />
          </div>
        </>
      )}

      <AddNewsOfferDrawer
        open={drawerOpen}
        item={editingItem}
        defaultType={activeTab}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        onDelete={editingItem ? () => handleDelete(editingItem) : undefined}
      />
    </div>
  );
}
