"use client";

import { useState } from "react";
import { Input, Select, Table, Tag, Pagination, Spin, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { EditProduct } from "@/components/products/EditProduct";
import {
  useListProductsAdmin,
  type IProductAdminData,
} from "@/services/product";
import ImportModal from "@/components/import-logs/ImportModal";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<"Genuine" | "Aftermarket" | "Branded" | undefined>();
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProductAdminData | null>(null);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const ITEMS_PER_PAGE = 20;

  const { data, isLoading, refetch } = useListProductsAdmin({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    type: typeFilter,
  });

  const getTypeTag = (type: string) => {
    const typeConfig: Record<string, { bg: string; color: string }> = {
      Genuine: { bg: "#E6F7FF", color: "#1890FF" },
      Aftermarket: { bg: "#F6FFED", color: "#52C41A" },
      Branded: { bg: "#F9F0FF", color: "#722ED1" },
    };
    const config = typeConfig[type] || { bg: "#F0F2F5", color: "#595959" };
    return (
      <Tag
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: "none",
          borderRadius: "41px",
          padding: "4px 12px",
        }}
      >
        {type}
      </Tag>
    );
  };

  const handleEditProduct = (record: IProductAdminData) => {
    setSelectedProduct(record);
    setEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setEditDrawerOpen(false);
    setSelectedProduct(null);
    refetch();
  };

  const columns: ColumnsType<IProductAdminData> = [
    {
      title: "Product Code",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (code: string) => <span className="font-mono font-semibold">{code}</span>,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: "Stock",
      key: "stock",
      width: 100,
      render: (_, record) => {
        const stock = record.stock?.stock ?? 0;
        return (
          <span className={stock > 0 ? "text-green-600 font-semibold" : "text-red-500"}>
            {stock} units
          </span>
        );
      },
    },
    {
      title: "Net 1",
      key: "net1",
      width: 100,
      render: (_, record) => `£${(record.price?.net1 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 2",
      key: "net2",
      width: 100,
      render: (_, record) => `£${(record.price?.net2 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 3",
      key: "net3",
      width: 100,
      render: (_, record) => `£${(record.price?.net3 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 4",
      key: "net4",
      width: 100,
      render: (_, record) => `£${(record.price?.net4 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 5",
      key: "net5",
      width: 100,
      render: (_, record) => `£${(record.price?.net5 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 6",
      key: "net6",
      width: 100,
      render: (_, record) => `£${(record.price?.net6 ?? 0).toFixed(2)}`,
    },
    {
      title: "Net 7",
      key: "net7",
      width: 100,
      render: (_, record) => `£${(record.price?.net7 ?? 0).toFixed(2)}`,
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleTypeChange = (value: "Genuine" | "Aftermarket" | "Branded") => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const tableData = data?.data?.map((product) => ({ ...product, key: product.id }));

  const totalRecords = data?.meta?.total ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  return (
    <>
      {contextHolder}
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage product inventory, pricing, and details.
            </p>
          </div>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setImportModalOpen(true)}
            className="h-[38px]! rounded-full!"
          >
            Import Products
          </Button>
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by product code or name"
            className="flex-1 h-[38px]!"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Filter by type"
            className="w-[200px] h-[38px]!"
            value={typeFilter}
            onChange={handleTypeChange}
            allowClear
            options={[
              { label: "Genuine", value: "Genuine" },
              { label: "Aftermarket", value: "Aftermarket" },
              { label: "Branded", value: "Branded" },
            ]}
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
              scroll={{ x: 1500 }}
              onRow={(record) => ({
                className: "cursor-pointer",
                onClick: () => handleEditProduct(record),
              })}
            />
          </Spin>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Showing {startRecord} - {endRecord} of {totalRecords} products
          </span>
          <Pagination
            current={currentPage}
            total={totalRecords}
            pageSize={ITEMS_PER_PAGE}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>

        <EditProduct
          open={editDrawerOpen}
          onClose={handleCloseEditDrawer}
          productData={selectedProduct}
        />

        <ImportModal
          open={importModalOpen}
          tabKey="products"
          onClose={() => setImportModalOpen(false)}
          onSuccess={() => {
            messageApi.success("Import completed successfully!");
            refetch();
          }}
          onError={(msg) => messageApi.error(msg)}
          onWarning={(msg) => messageApi.warning(msg)}
        />
      </div>
    </>
  );
}
