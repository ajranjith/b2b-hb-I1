"use client";

import { useState, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input, Select, Table, Pagination, Spin, Button, App, DatePicker, type TimeRangePickerProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import {
  useListOrders,
  exportOrders,
  type IOrderData,
  type OrderStatus,
} from "@/services/order";
import { getOrderStatusTag } from "@/services/order/statusUtils";
import { downloadBlob } from "@/utils/downloadBlob";
import dayjs from "dayjs";
import OrderDetailDrawer from "@/components/order-logs/OrderDetailDrawer";

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

export default function OrderLogsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const ITEMS_PER_PAGE = 20;

  const { data, isLoading } = useListOrders({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status: statusFilter,
    startDate: dateRange?.[0]?.format("YYYY-MM-DD HH:mm:ss"),
    endDate: dateRange?.[1]?.format("YYYY-MM-DD HH:mm:ss"),
  });

  const orderIdParam = searchParams.get("orderId");
  const selectedOrderId = orderIdParam ? parseInt(orderIdParam, 10) : null;

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId || !data?.data) return null;
    return data.data.find((order) => order.id === selectedOrderId) || null;
  }, [selectedOrderId, data?.data]);

  const detailDrawerOpen = !!selectedOrderId;

  const columns: ColumnsType<IOrderData> = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 150,
    },
    {
      title: "Billing Order No",
      dataIndex: "billingOrderNo",
      key: "billingOrderNo",
      width: 150,
      render: (value: string | null) => value || "-",
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.billing.firstName} {record.billing.lastName}
          </div>
          {record.billing.companyName && (
            <div className="text-xs text-gray-500">{record.billing.companyName}</div>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: ["billing", "email"],
      key: "email",
      width: 200,
    },
    {
      title: "Items / Qty",
      key: "items",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div>
          {record.itemCount} / {record.totalQuantity}
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "formattedTotal",
      key: "totalAmount",
      width: 120,
      align: "right",
    },
    {
      title: "Shipping Method",
      dataIndex: ["shippingMethod", "name"],
      key: "shippingMethod",
      width: 150,
      render: (value: string | undefined) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      width: 150,
      render: (status: OrderStatus) => getOrderStatusTag(status),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 180,
      render: (date: string) => dayjs(date).format("DD-MM-YYYY, hh:mmA"),
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: OrderStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const tableData = data?.data?.map((order) => ({ ...order, key: order.id.toString() }));

  const totalRecords = data?.meta?.total ?? 0;
  const startRecord = totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await exportOrders({
        search: search || undefined,
        status: statusFilter,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD HH:mm:ss"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD HH:mm:ss"),
      });
      downloadBlob(blob, `orders-export-${dayjs().format("YYYY-MM-DD")}.xlsx`);
      message.success("Export downloaded successfully.");
    } catch {
      message.error("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const closeDetailDrawer = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("orderId");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  };

  const openOrderDetail = (orderId: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("orderId", orderId.toString());
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, track, and manage all orders placed by dealers.
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
          placeholder="Search by order number"
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
            { label: "Created", value: "CREATED" },
            { label: "Processing", value: "PROCESSING" },
            { label: "Backorder", value: "BACKORDER" },
            { label: "Ready for Shipment", value: "READY_FOR_SHIPMENT" },
            { label: "Fulfilled", value: "FULLFILLED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />
        <DatePicker.RangePicker
          className="h-[38px]!"
          value={dateRange ?? undefined}
          onChange={handleDateRangeChange}
          allowClear
          showTime={{ format: "hh:mmA" }}
          format="DD-MM-YYYY hh:mmA"
          presets={rangePresets}
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
            scroll={{ x: 1400 }}
            onRow={(record) => ({
              className: "cursor-pointer",
              onClick: () => openOrderDetail(record.id),
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

      <OrderDetailDrawer open={detailDrawerOpen} order={selectedOrder} onClose={closeDetailDrawer} />
    </div>
  );
}
