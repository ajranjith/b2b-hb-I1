"use client";

import { useState } from "react";
import { Button, Input, Select, Table, Tag, Pagination, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { CreateAdmin } from "@/components/user-management/CreateAdmin";
import { useListAdmins, type IAdminData } from "@/services/admin";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<IAdminData | null>(null);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, refetch } = useListAdmins({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status: statusFilter,
  });

  const getStatusTag = (status: boolean) => (
    <Tag
      style={{
        backgroundColor: status ? "#E6F7D9" : "#FFF1F0",
        color: status ? "#389E0D" : "#CF1322",
        border: "none",
        borderRadius: "41px",
        padding: "4px 12px",
      }}
    >
      {status ? "Active" : "Inactive"}
    </Tag>
  );

  const handleEdit = (record: IAdminData) => {
    setEditingAdmin(record);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingAdmin(null);
    refetch();
  };

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setDrawerOpen(true);
  };

  const columns: ColumnsType<IAdminData> = [
    {
      title: "Name",
      key: "name",
      width: 200,
      render: (_, record) =>
        `${record.firstName}${record.lastName ? ` ${record.lastName}` : ""}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Role",
      key: "role",
      width: 120,
      render: (_, record) => <Tag color="blue">{record.role.name}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: boolean) => getStatusTag(status),
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: boolean) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const tableData = data?.data?.map((admin) => ({ ...admin, key: admin.id.toString() }));

  const totalRecords = data?.meta?.total ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, manage, and maintain detailed records of all admin users.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAdmin}
          className="rounded-[33px]! h-[42px]! px-6"
        >
          Add new admin
        </Button>
      </div>

      <hr className="border-t border-gray-200 mb-4" />

      <div className="flex items-center gap-3 mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name or email"
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
            { label: "Active", value: true },
            { label: "Inactive", value: false },
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

      <CreateAdmin open={drawerOpen} onClose={handleCloseDrawer} initialData={editingAdmin} />
    </div>
  );
}
