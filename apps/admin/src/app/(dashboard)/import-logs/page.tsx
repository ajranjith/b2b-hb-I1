"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Table, Pagination, Spin, Button, Tabs, App, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined, EyeOutlined, ImportOutlined, CloudOutlined, UserOutlined, LinkOutlined } from "@ant-design/icons";
import {
  useListImportLogs,
  fetchImportTemplate,
  type IImportLogData,
  type ImportType,
  type ImportStatus,
  type ImportTemplateType,
  type ImportSource,
  getImportLogStatusTag,
} from "@/services/importLog";
import { downloadBlob } from "@/utils/downloadBlob";
import dayjs from "dayjs";
import ImportModal from "@/components/import-logs/ImportModal";
import ImportDetailDrawer from "@/components/import-logs/ImportDetailDrawer";

const TAB_TYPE_MAP: { key: string; type: ImportType; label: string }[] = [
  { key: "products", type: "PARTS", label: "Products" },
  { key: "dealers", type: "DEALERS", label: "Dealers" },
  { key: "superseded", type: "SUPERSEDED", label: "Superseded" },
  { key: "backorder", type: "BACKORDER", label: "Back Orders" },
  { key: "order-status", type: "ORDER_STATUS", label: "Orders Overall Status" },
];

const TAB_TO_TEMPLATE_TYPE: Record<string, ImportTemplateType> = {
  products: "product",
  dealers: "dealer",
  superseded: "superseded",
  backorder: "Backlog",
  "order-status": "overallStatus",
};

export default function ImportLogsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();

  const tabFromUrl = searchParams.get("tab") || "products";
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTabKey, setActiveTabKey] = useState(tabFromUrl);
  const [statusFilter, setStatusFilter] = useState<ImportStatus | undefined>();
  const [templateLoading, setTemplateLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IImportLogData | null>(null);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const tab = searchParams.get("tab") || "products";
    setActiveTabKey(tab);
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", activeTabKey);
    router.replace(`${pathname}?${next.toString()}`);
  }, [activeTabKey, pathname, router, searchParams]);

  const templateType = TAB_TO_TEMPLATE_TYPE[activeTabKey];
  const typeFilter = TAB_TYPE_MAP.find((t) => t.key === activeTabKey)?.type ?? "PARTS";

  const { data, isLoading, refetch } = useListImportLogs({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    type: typeFilter,
    status: statusFilter,
  });

  const columns: ColumnsType<IImportLogData> = [
    {
      title: "Import ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Source",
      dataIndex: "importSource",
      key: "importSource",
      width: 110,
      render: (source: ImportSource) => {
        if (source === "SHAREPOINT") {
          return (
            <Tag color="blue" icon={<CloudOutlined />}>
              SharePoint
            </Tag>
          );
        }
        return (
          <Tag color="default" icon={<UserOutlined />}>
            Manual
          </Tag>
        );
      },
    },
    {
      title: "Files",
      dataIndex: "fileName",
      key: "fileName",
      width: 180,
      render: (fileName: string, record) => (
        <div className="flex items-center gap-2">
          <span className="truncate">{fileName}</span>
          {record.fileUrl && (
            <Tooltip title="Download file from Azure">
              <a
                href={record.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-primary hover:text-blue-600"
              >
                <LinkOutlined />
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Imported By",
      dataIndex: "importedBy",
      key: "importedBy",
      width: 140,
      render: (importedBy: IImportLogData["importedBy"]) =>
        importedBy ? (
          <Tooltip title={importedBy.email}>
            <span>{importedBy.name}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400">System</span>
        ),
    },
    {
      title: "Total Rows",
      dataIndex: "totalRows",
      key: "totalRows",
      width: 100,
      align: "right",
      render: (val: number) => (val != null ? val.toLocaleString() : "-"),
    },
    {
      title: "Records Affected",
      dataIndex: "successCount",
      key: "successCount",
      width: 130,
      align: "right",
      render: (val: number) => (val != null ? val.toLocaleString() : "-"),
    },
    {
      title: "Error",
      dataIndex: "errorCount",
      key: "errorCount",
      width: 80,
      align: "right",
      render: (val: number) => (val != null ? val.toLocaleString() : "-"),
    },
    {
      title: "Duration",
      dataIndex: "durationMs",
      key: "durationMs",
      width: 100,
      align: "right",
      render: (ms: number | null) => {
        if (!ms) return "-";
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
      },
    },
    {
      title: "Status",
      dataIndex: "importStatus",
      key: "importStatus",
      width: 100,
      render: (status: ImportStatus) => getImportLogStatusTag(status),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      width: 120,
      render: (date: string) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record);
            setDetailDrawerOpen(true);
          }}
          className="p-0 text-primary! items-center!"
        >
          View
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowKeys([]);
  };

  const handleDownloadSample = async () => {
    if (!templateType) return;
    setTemplateLoading(true);
    try {
      const blob = await fetchImportTemplate(templateType);
      downloadBlob(
        blob,
        `${templateType.slice(0, 1).toUpperCase() + templateType.slice(1)}-template-${dayjs().format("YYYY-MM-DD")}.xlsx`
      );
      message.success("Sample template downloaded.");
    } catch {
      message.error("Failed to download template. Please try again.");
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleImportModalClose = () => {
    setImportModalOpen(false);
    refetch();
  };

  const tableData =
    data?.data?.map((log: IImportLogData) => ({
      ...log,
      key: log.id,
    })) ?? [];
  const totalRecords = data?.meta?.total ?? 0;
  const startRecord =
    totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Imports</h1>
        <p className="text-sm text-gray-500 mt-1">
          View, manage, and maintain detailed records of all orders.
        </p>
      </div>
      <hr className="border-t border-gray-200 mb-4" />

      <div className="w-full border-b border-gray-200 mb-4">
        <Tabs
          activeKey={activeTabKey}
          onChange={(key) => {
            setActiveTabKey(key);
            setCurrentPage(1);
            setSelectedRowKeys([]);
          }}
          items={TAB_TYPE_MAP.map(({ key, label }) => ({
            key,
            label,
          }))}
        />
      </div>
      <div className="flex items-center justify-end gap-3 mb-4 flex-wrap">
        <Button
          type="default"
          className="rounded-[33px]! h-10! px-6 w-[224px]! border-primary! text-primary!"
          icon={<DownloadOutlined />}
          onClick={handleDownloadSample}
          loading={templateLoading}
          disabled={!templateType}
        >
          Download Sample Excel
        </Button>
        <Button
          type="primary"
          className="rounded-[33px]! h-10! px-6 w-[124px]!"
          icon={<ImportOutlined />}
          onClick={() => setImportModalOpen(true)}
        >
          Import
        </Button>
      </div>

      <ImportModal
        open={importModalOpen}
        tabKey={activeTabKey}
        onClose={handleImportModalClose}
        onSuccess={() => {
          message.success("Import completed.");
          refetch();
        }}
        onError={(msg) => message.error(msg)}
        onWarning={(msg) => message.warning(msg)}
      />
      <ImportDetailDrawer
        open={detailDrawerOpen}
        record={selectedRecord}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />
      <div className="flex-1">
        <Spin spinning={isLoading}>
          <Table
            size="small"
            columns={columns}
            dataSource={tableData}
            rowSelection={rowSelection}
            pagination={false}
            bordered={false}
          />
        </Spin>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">
          Showing {startRecord} - {endRecord} of {totalRecords} records
        </span>
        <Pagination
          current={currentPage}
          total={totalRecords}
          pageSize={ITEMS_PER_PAGE}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
