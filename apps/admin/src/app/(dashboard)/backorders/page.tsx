"use client";

import { useState } from "react";
import { Input, Table, Pagination, Spin, Button, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import {
  useListBackorderProducts,
  exportBackorderProducts,
  type IBackorderProduct,
} from "@/services/order";
import { downloadBlob } from "@/utils/downloadBlob";
import dayjs from "dayjs";

const PAGE_SIZE = 20;

export default function BackordersPage() {
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [exportLoading, setExportLoading] = useState(false);

  const { data, isLoading } = useListBackorderProducts({
    page: currentPage,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const columns: ColumnsType<IBackorderProduct> = [
    {
      title: "Your Order No",
      dataIndex: "billingOrderNo",
      key: "billingOrderNo",
      width: 150,
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Our No",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 150,
      render: (text: string) => <span className="font-medium text-blue-600">{text}</span>,
    },
    {
      title: "Itm",
      dataIndex: "itemNumber",
      key: "itemNumber",
      align: "center",
      width: 80,
      render: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      title: "Part",
      dataIndex: "productCode",
      key: "productCode",
      width: 150,
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "productName",
      key: "productName",
      ellipsis: true,
    },
    {
      title: "Q Ord",
      dataIndex: "qtyOrdered",
      key: "qtyOrdered",
      align: "center",
      width: 100,
      render: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      title: "Q/O",
      dataIndex: "qtyOutstanding",
      key: "qtyOutstanding",
      align: "center",
      width: 100,
      render: (value: number) => <span className="font-medium text-orange-600">{value}</span>,
    },
    {
      title: "In WH",
      dataIndex: "inWarehouse",
      key: "inWarehouse",
      align: "center",
      width: 100,
      render: (value: number) => <span>{value}</span>,
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await exportBackorderProducts({ search: search || undefined });
      downloadBlob(blob, `backorder-products-${dayjs().format("DD-MM-YYYY")}.xlsx`);
      message.success("Export downloaded successfully.");
    } catch {
      message.error("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const tableData = data?.data?.map((product) => ({ ...product, key: product.id.toString() }));

  const totalRecords = data?.meta?.total ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endRecord = Math.min(currentPage * PAGE_SIZE, totalRecords);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Backorder Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all products with backorder status across all orders.
          </p>
        </div>
        <Button
          className="rounded-[33px]! h-[42px]! px-6 w-[124px]!"
          type="primary"
          icon={<ExportOutlined />}
          onClick={handleExport}
          loading={exportLoading}
        >
          Export
        </Button>
      </div>

      <hr className="border-t border-gray-200 mb-4" />

      <div className="flex items-center gap-3 mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by order number, product code or product name"
          className="flex-1 h-[38px]!"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </div>

      <div className="flex-1">
        <Spin spinning={isLoading}>
          <Table
            size="small"
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered={false}
            scroll={{ x: 1200 }}
            locale={{ emptyText: "No backorder products found" }}
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
          pageSize={PAGE_SIZE}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
