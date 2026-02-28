"use client";

import { useMemo, useState } from "react";
import { Button, App, Spin, message, Select, Pagination, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddBannerDrawer, {
  type BannerItem,
} from "@/components/content-management/AddBannerDrawer";
import emptyStateImg from "@/assets/images/empty_state.png";
import {
  useListBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  type BannerType,
} from "@/services/cms";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

type BannerTabType = "horizontal" | "vertical";

function mapApiToBanner(api: {
  id: number;
  type: "Horizontal" | "Vertical";
  title: string;
  description: string;
  imgae: string;
  link?: string | null;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}): BannerItem {
  return {
    id: api.id,
    type: api.type,
    title: api.title,
    description: api.description,
    imgae: api.imgae,
    imageUrl: api.imgae,
    link: api.link || undefined,
    orderNo: api.orderNo,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    status: api.status,
  };
}

export default function BannersPage() {
  const { modal } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [activeTab, setActiveTab] = useState<BannerTabType>("horizontal");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const typeParam: BannerType = activeTab === "horizontal" ? "Horizontal" : "Vertical";
  const { data, isLoading, isError } = useListBanners({
    page: currentPage,
    limit: pageSize,
    type: typeParam,
  });
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const banners: BannerItem[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiToBanner);
  }, [data]);

  const meta = data?.meta;
  const totalRecords = meta?.total ?? data?.data?.length ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const handleAddNew = () => {
    setEditingBanner(null);
    setDrawerOpen(true);
  };

  const handleEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = (values: {
    type: "Horizontal" | "Vertical";
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
  }) => {
    if (editingBanner) {
      updateMutation.mutate(
        {
          id: editingBanner.id,
          body: {
            type: values.type,
            title: values.title,
            description: values.description,
            imgae: values.imageUrl,
            link: values.link,
            orderNo: editingBanner.orderNo ?? 0,
            status: editingBanner.status,
          },
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to update banner");
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          type: values.type,
          title: values.title,
          description: values.description,
          imgae: values.imageUrl,
          link: values.link,
          orderNo: 0,
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to create banner");
          },
        }
      );
    }
  };

  const handleDelete = (banner: BannerItem) => {
    setDrawerOpen(false);
    modal.confirm({
      title: "Delete banner",
      content: `Are you sure you want to delete "${banner.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteMutation.mutateAsync(banner.id);
        setEditingBanner(null);
      },
    });
  };

  if (isError) {
    return (
      <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
        <p className="text-red-500">Failed to load banners.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
          <p className="text-gray-500 mt-1">
            View, manage, and maintain contents that can be displayed in the main portal.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="shrink-0 h-[42px]! min-w-[164px] rounded-[33px]!"
        >
          Add New Banner
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => {
          setActiveTab(k as BannerTabType);
          setCurrentPage(1);
        }}
        className="news-offers-tabs h-[52px]! mb-5.5!"
        items={[
          { key: "horizontal", label: "Horizontal" },
          { key: "vertical", label: "Vertical" },
        ]}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <img
            src={emptyStateImg.src}
            alt="No banners"
            className="mb-7 object-contain w-[249px] h-[153px]"
          />
          <p className="text-lg font-medium text-gray-900 mb-6">
            No {activeTab} banners yet. Add your first banner to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="h-[291px] p-4 flex flex-col border border-[#D6CFCFA6] rounded-[14px] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-3/2 w-full bg-[#EEF2F8] overflow-hidden">
                {banner.imgae || banner.imageUrl ? (
                  <img
                    src={banner.imgae || banner.imageUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 relative mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-base flex-1">{banner.title}</p>
                </div>
                <p className="text-sm text-[#6A6A6A] mt-1 line-clamp-2 flex-1">
                  {banner.description}
                </p>
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(banner);
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
                      handleDelete(banner);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    danger
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && totalRecords > 0 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
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
      )}

      <AddBannerDrawer
        open={drawerOpen}
        banner={editingBanner}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        onDelete={editingBanner ? () => handleDelete(editingBanner) : undefined}
      />
    </div>
  );
}
