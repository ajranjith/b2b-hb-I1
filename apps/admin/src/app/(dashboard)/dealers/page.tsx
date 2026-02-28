"use client";

import { useState } from "react";
import { Button, Input, Select, Table, Tag, Pagination, Spin, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined, UploadOutlined, LockOutlined } from "@ant-design/icons";
import { CreateDealer } from "@/components/dealers/CreateDealer";
import {
  useListDealers,
  type IDealerData,
  type DealerAccountStatus,
} from "@/services/dealer";
import ImportModal from "@/components/import-logs/ImportModal";

export default function DealersPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editingDealer, setEditingDealer] = useState<IDealerData | null>(null);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<DealerAccountStatus | undefined>();
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, refetch } = useListDealers({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    accountStatus: statusFilter,
  });

  const getStatusTag = (status: DealerAccountStatus) => {
    const statusConfig = {
      Active: { bg: "#E6F7D9", color: "#389E0D" },
      Inactive: { bg: "#FFF7E6", color: "#FA8C16" },
      Suspended: { bg: "#F0F2F5", color: "#595959" },
    };
    const config = statusConfig[status];
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
        {status}
      </Tag>
    );
  };

  const handleEdit = (record: IDealerData) => {
    setEditingDealer(record);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingDealer(null);
    refetch();
  };

  const handleAddDealer = () => {
    setEditingDealer(null);
    setDrawerOpen(true);
  };

  const handleImportSuccess = () => {
    messageApi.success("Import completed successfully!");
    refetch();
  };

  const columns: ColumnsType<IDealerData> = [
    {
      title: "Account Number",
      dataIndex: ["dealer", "accountNumber"],
      key: "accountNumber",
      width: 150,
    },
    {
      title: "Name",
      key: "name",
      width: 150,
      render: (_, record) =>
        `${record.firstName}${record.lastName ? ` ${record.lastName}` : ""}`,
    },
    {
      title: "Company",
      dataIndex: ["dealer", "companyName"],
      key: "company",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Tiers",
      children: [
        { title: "GN", dataIndex: ["dealer", "genuinePartsTier"], key: "tierGN", width: 80 },
        { title: "ES", dataIndex: ["dealer", "aftermarketESTier"], key: "tierES", width: 80 },
        { title: "B", dataIndex: ["dealer", "aftermarketBTier"], key: "tierB", width: 80 },
      ],
    },
    {
      title: "Status",
      key: "status",
      width: 160,
      render: (_: unknown, record: IDealerData) => (
        <div className="flex items-center gap-2">
          {getStatusTag(record.dealer.accountStatus)}
          {record.isLocked && (
            <Tooltip title="Account locked due to failed login attempts">
              <Tag icon={<LockOutlined />} color="error" style={{ margin: 0 }}>Locked</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowKeys([]);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: DealerAccountStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const tableData = data?.data?.map((dealer) => ({
    ...dealer,
    key: dealer.id.toString(),
  }));

  const totalRecords = data?.meta?.total ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  return (
    <>
      {contextHolder}
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dealer Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              View, manage, and maintain detailed records of all registered dealers.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              icon={<UploadOutlined />}
              onClick={() => setImportModalOpen(true)}
              className="rounded-[33px]! h-[42px]! px-6"
            >
              Import Dealers
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDealer}
              className="rounded-[33px]! h-[42px]! px-6"
            >
              Add new dealer
            </Button>
          </div>
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, company, email or account number"
            className="flex-1 h-[38px]!"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Select status"
            className="w-[200px] h-[38px]!"
            value={statusFilter}
            onChange={handleStatusChange}
            allowClear
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
              { label: "Suspended", value: "Suspended" },
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
              onRow={(record) => ({
                className: "cursor-pointer",
                onClick: () => handleEdit(record),
              })}
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

        <CreateDealer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          initialData={editingDealer}
        />

        <ImportModal
          open={importModalOpen}
          tabKey="dealers"
          onClose={() => setImportModalOpen(false)}
          onSuccess={handleImportSuccess}
          onError={(msg) => messageApi.error(msg)}
          onWarning={(msg) => messageApi.warning(msg)}
        />
      </div>
    </>
  );
}
