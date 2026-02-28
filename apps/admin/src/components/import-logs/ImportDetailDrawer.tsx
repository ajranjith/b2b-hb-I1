"use client";

import { useQuery } from "@tanstack/react-query";
import { Drawer, Button, Table, Pagination, Spin, Select, Modal, App, Tag, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CloseOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CloudOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  fetchImportStats,
  fetchImportErrors,
  fetchImportErrorsExport,
  getImportLogStatusTag,
  type IImportLogData,
  type IImportErrorDetailItem,
  type ImportStatus,
  type ImportSource,
} from "@/services/importLog";
import { downloadBlob } from "@/utils/downloadBlob";
import { useState } from "react";
import type { FC } from "react";
import { ImportLogStatsCard } from "./ImportLogStatsCard";
import dayjs from "dayjs";

interface ImportDetailDrawerProps {
  open: boolean;
  record: IImportLogData | null;
  onClose: () => void;
}

const ERROR_PAGE_SIZE_OPTIONS = [10, 20, 50];

const ImportDetailDrawer: FC<ImportDetailDrawerProps> = ({
  open,
  record,
  onClose,
}) => {
  const { message } = App.useApp();
  const importId = record?.id ?? 0;
  const [errorPage, setErrorPage] = useState(1);
  const [errorPageSize, setErrorPageSize] = useState(10);
  const [exportLoading, setExportLoading] = useState(false);
  const [rowDataView, setRowDataView] = useState<{
    rowNumber: number;
    rowData: unknown;
  } | null>(null);

  const handleDownloadErrorRows = async () => {
    if (!importId) return;
    setExportLoading(true);
    try {
      const blob = await fetchImportErrorsExport(importId);
      downloadBlob(
        blob,
        `import-${importId}-error-rows-${dayjs().format("YYYY-MM-DD")}.xlsx`
      );
      message.success("Error rows downloaded.");
    } catch {
      message.error("Failed to download error rows. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const { data: statsData } = useQuery({
    queryKey: ["import", importId, "stats"],
    queryFn: () => fetchImportStats(importId),
    enabled: open && importId > 0,
  });

  const { data: errorsData, isLoading: errorsLoading } = useQuery({
    queryKey: ["import", importId, "errors", errorPage, errorPageSize],
    queryFn: () =>
      fetchImportErrors(importId, { page: errorPage, limit: errorPageSize }),
    enabled: open && importId > 0,
  });

  const stats = statsData?.data;
  const errors = errorsData?.data ?? [];
  const errorsMeta = errorsData?.meta;
  const totalErrors = errorsMeta?.total ?? 0;
  const startRecord = totalErrors > 0 ? (errorPage - 1) * errorPageSize + 1 : 0;
  const endRecord = Math.min(errorPage * errorPageSize, totalErrors);

  const columns: ColumnsType<IImportErrorDetailItem> = [
    {
      title: "Row No",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 100,
      render: (val: number) => val?.toLocaleString() ?? "-",
    },
    {
      title: "Error",
      dataIndex: "errors",
      key: "errors",
      ellipsis: true,
      render: (errs: string[]) =>
        Array.isArray(errs) ? errs.join("; ") || "-" : "-",
    },
    {
      title: "Data",
      key: "data",
      width: 100,
      render: (_, row) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() =>
            setRowDataView({ rowNumber: row.rowNumber, rowData: row.rowData })
          }
          className="p-0 text-primary! items-center!"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title={null}
      placement="right"
      width="50%"
      open={open}
      onClose={onClose}
      closable={false}
      styles={{ body: { padding: 0 } }}
      className="import-detail-drawer"
    >
      {!record ? null : (
        <div className="flex flex-col h-full px-6 pt-4">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-semibold text-gray-900">
                {record.id}
              </span>
              {getImportLogStatusTag(record.importStatus as ImportStatus)}
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className="shrink-0 w-9 h-9"
              aria-label="Close"
            />
          </div>
          <div className="pt-5 pb-4 border-b border-gray-100">
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Import Source">
                {record.importSource === "SHAREPOINT" ? (
                  <Tag color="blue" icon={<CloudOutlined />}>
                    SharePoint
                  </Tag>
                ) : (
                  <Tag color="default" icon={<UserOutlined />}>
                    Manual
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Imported By">
                {record.importedBy ? record.importedBy.name : (
                  <span className="text-gray-400">System</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="File Name">
                <div className="flex items-center gap-2">
                  <span>{record.fileName}</span>
                  {record.fileUrl && (
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-blue-600"
                      title="Download from Azure"
                    >
                      <LinkOutlined />
                    </a>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {record.durationMs ? (
                  <>
                    <ClockCircleOutlined className="mr-1" />
                    {record.durationMs < 1000
                      ? `${record.durationMs}ms`
                      : record.durationMs < 60000
                      ? `${(record.durationMs / 1000).toFixed(1)}s`
                      : `${(record.durationMs / 60000).toFixed(1)}m`}
                  </>
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Import Date">
                {dayjs(record.createdAt).format("DD MMM YYYY, HH:mm")}
              </Descriptions.Item>
              {record.sharePointFileId && (
                <Descriptions.Item label="SharePoint File ID">
                  <span className="text-xs font-mono text-gray-600">
                    {record.sharePointFileId}
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <div className="flex justify-end items-center pt-4 pb-3">
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleDownloadErrorRows}
              loading={exportLoading}
              disabled={!importId}
              className="h-10.5! rounded-[38px]! px-4 text-primary! border-primary!"
            >
              Download Error Rows
            </Button>
          </div>

          <div className="pb-6">
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <ImportLogStatsCard
                  title="Total Rows"
                  value={stats.totalRows}
                  bgColor="#E2ECF680"
                  textColor="#0C4394"
                  icon={<UnorderedListOutlined style={{ fontSize: 19 }} />}
                />
                <ImportLogStatsCard
                  title="Rows Affected"
                  value={stats.successCount}
                  bgColor="#EBF4ED"
                  textColor="#05751C"
                  icon={<CheckCircleOutlined style={{ fontSize: 19 }} />}
                />
                <ImportLogStatsCard
                  title="Error Rows"
                  value={stats.errorCount}
                  bgColor="#FFEFEF"
                  textColor="#C11631"
                  icon={<ExclamationCircleOutlined style={{ fontSize: 19 }} />}
                />
              </div>
            )}
          </div>

          <div className="flex-1 import-errors-table">
            <Spin spinning={errorsLoading}>
              <div className="max-h-[59vh] overflow-y-auto">
                <Table
                  size="small"
                  columns={columns}
                  dataSource={errors.map((e) => ({ ...e, key: e.id }))}
                  pagination={false}
                  bordered={false}
                  className="flex-1"
                />
              </div>
              {errorsMeta && totalErrors > 0 && (
                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={errorPageSize}
                      onChange={(v) => {
                        setErrorPageSize(v);
                        setErrorPage(1);
                      }}
                      options={ERROR_PAGE_SIZE_OPTIONS.map((n) => ({
                        label: String(n),
                        value: n,
                      }))}
                      className="w-[72px]"
                    />
                    <span className="text-sm text-gray-600">
                      Showing {startRecord} - {endRecord} of {totalErrors} records
                    </span>
                  </div>
                  <Pagination
                    current={errorPage}
                    total={totalErrors}
                    pageSize={errorPageSize}
                    showSizeChanger={false}
                    onChange={setErrorPage}
                    showLessItems
                  />
                </div>
              )}
            </Spin>
          </div>
        </div>
      )}

      <Modal
        title={`Row ${rowDataView?.rowNumber ?? ""} data`}
        open={rowDataView !== null}
        onCancel={() => setRowDataView(null)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setRowDataView(null)}
          >
            Close
          </Button>,
        ]}
        width={560}
        centered
        destroyOnClose
      >
        {rowDataView && <RowDataContent rowData={rowDataView.rowData} />}
      </Modal>
    </Drawer>
  );
};

function RowDataContent({ rowData }: { rowData: unknown }) {
  if (rowData == null) {
    return <p className="text-gray-500 text-sm m-0">No data for this row.</p>;
  }
  if (typeof rowData !== "object" || Array.isArray(rowData)) {
    return (
      <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh] m-0">
        {JSON.stringify(rowData, null, 2)}
      </pre>
    );
  }
  const entries = Object.entries(rowData);
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between gap-4 py-3 px-4 text-sm bg-white hover:bg-gray-50/80"
          >
            <span className="font-medium text-gray-700 shrink-0 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-gray-900 text-right break-all tabular-nums">
              {value !== null && typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImportDetailDrawer;
