"use client";

import { useState, useMemo } from "react";
import { Button, Pagination, Select, App, Spin, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddLinkDrawer, {
  type ExternalLinkItem,
} from "@/components/content-management/AddLinkDrawer";
import {
  useListExternalLinks,
  useCreateExternalLink,
  useUpdateExternalLink,
  useDeleteExternalLink,
} from "@/services/cms";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

function mapApiToItem(api: {
  id: number;
  image: string;
  title: string;
  link: string;
  orderNo: number | null;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}): ExternalLinkItem {
  return {
    id: api.id,
    title: api.title,
    link: api.link,
    image: api.image,
    thumbnailUrl: api.image,
    orderNo: api.orderNo,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    status: api.status,
  };
}

export default function ExternalLinksPage() {
  const { modal } = App.useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExternalLinkItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError } = useListExternalLinks({
    page: currentPage,
    limit: pageSize,
  });
  const createMutation = useCreateExternalLink();
  const updateMutation = useUpdateExternalLink();
  const deleteMutation = useDeleteExternalLink();

  const links: ExternalLinkItem[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiToItem);
  }, [data]);

  const meta = data?.meta;
  const totalRecords = meta?.total ?? data?.data?.length ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const handleAddNew = () => {
    setEditingLink(null);
    setDrawerOpen(true);
  };

  const handleEdit = (link: ExternalLinkItem) => {
    setEditingLink(link);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingLink(null);
  };

  const handleSubmit = (values: {
    title: string;
    link: string;
    imageUrl: string;
  }) => {
    if (editingLink) {
      updateMutation.mutate(
        {
          id: editingLink.id,
          body: {
            image: values.imageUrl,
            title: values.title,
            link: values.link,
            orderNo: editingLink.orderNo ?? 0,
            status: editingLink.status,
          },
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to update link");
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          image: values.imageUrl,
          title: values.title,
          link: values.link,
        },
        {
          onSuccess: () => handleCloseDrawer(),
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err?.response?.data?.message || "Failed to create link");
          },
        }
      );
    }
  };

  const handleDelete = (link: ExternalLinkItem) => {
    setDrawerOpen(false);
    modal.confirm({
      title: "Delete link",
      content: `Are you sure you want to delete "${link.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteMutation.mutateAsync(link.id);
        setEditingLink(null);
      },
    });
  };

  const formatDate = (iso: string) => dayjs(iso).format("DD-MM-YYYY");

  if (isError) {
    return (
      <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
        <p className="text-red-500">Failed to load external links.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-150px)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">External Links</h1>
          <p className="text-gray-500 mt-1">
            View, manage, and maintain contents that can be displayed in the main portal.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="shrink-0 h-[42px]! w-[164px]! rounded-[33px]!"
        >
          Add New Link
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 auto-rows-min">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-2 px-2.5 py-2.5 w-full border border-[#D6CFCFA6] rounded-[14px] bg-white relative overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center w-full gap-2">
                  <div className="w-[68px] h-[68px] rounded-lg bg-[#EEF2F8] overflow-hidden flex items-center justify-center">
                    {link.image ? (
                      <img
                        src={link.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                        {link.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base">{link.title}</p>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black/40! hover:text-primary! hover:underline! flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LinkOutlined size={14} className="shrink-0" /> {link.link || "—"}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 absolute top-2 right-2">
                    {formatDate(link.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(link);
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
                      handleDelete(link);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    danger
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Select
                value={pageSize}
                onChange={(v) => {
                  setPageSize(v);
                  setCurrentPage(1);
                }}
                options={PAGE_SIZE_OPTIONS.map((n) => ({ label: String(n), value: n }))}
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

      <AddLinkDrawer
        open={drawerOpen}
        link={editingLink}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        onDelete={editingLink ? () => handleDelete(editingLink) : undefined}
      />
    </div>
  );
}
