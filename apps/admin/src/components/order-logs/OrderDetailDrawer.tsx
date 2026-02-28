"use client";

import { Drawer, Button, App } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useState } from "react";
import type { IOrderData, IOrderItem } from "@/services/order/contract";
import { getOrderStatusTag } from "@/services/order/statusUtils";
import { exportOrder } from "@/services/order";
import { downloadBlob } from "@/utils/downloadBlob";
import dayjs from "dayjs";

interface OrderDetailDrawerProps {
  open: boolean;
  order: IOrderData | null;
  onClose: () => void;
}

const formatOrderDate = (date: string) => dayjs(date).format("DD-MM-YYYY, hh:mmA");

const InfoRow: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-[15px] text-gray-900 leading-snug">{value}</span>
  </div>
);

const OrderDetailDrawer: FC<OrderDetailDrawerProps> = ({ open, order, onClose }) => {
  const { message } = App.useApp();
  const [exportLoading, setExportLoading] = useState(false);

  if (!order) return null;

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await exportOrder(order.id);
      downloadBlob(blob, `order_${order.orderNumber}_export.xlsx`);
      message.success("Order exported successfully");
    } catch {
      message.error("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const billingName = [order.billing.firstName, order.billing.lastName].filter(Boolean).join(" ");
  const hasItems = order.items && order.items.length > 0;
  const displayItems: Array<{ code: string; description: string; quantity: number; price: string }> = hasItems
    ? (order.items as IOrderItem[]).map((item) => ({
        code: item.productCode ?? item.product?.code ?? "—",
        description: item.productName ?? item.product?.name ?? "—",
        quantity: item.quantity,
        price: item.formattedSubtotal ?? order.formattedTotal,
      }))
    : [
        {
          code: "—",
          description: "—",
          quantity: order.totalQuantity,
          price: order.formattedTotal,
        },
      ];

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>Order Details</span>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={exportLoading}
            onClick={handleExport}
            className="rounded-[33px]!"
          >
            Export
          </Button>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={640}
      closable
      maskClosable
      className="order-detail-drawer"
      styles={{
        header: {
          padding: "20px 28px",
          borderBottom: "1px solid #e5e7eb",
          fontSize: "18px",
          fontWeight: 600,
        },
        body: {
          padding: "28px",
          background: "#f1f5f9",
          overflow: "auto",
        },
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xl font-bold text-gray-900">#{order.orderNumber}</span>
            {getOrderStatusTag(order.orderStatus)}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <InfoRow label="Order date" value={formatOrderDate(order.orderDate)} />
            <InfoRow label="Dispatch method" value={order.shippingMethod?.name ?? "—"} />
            <InfoRow
              label="Items"
              value={`${order.itemCount} item${order.itemCount !== 1 ? "s" : ""}`}
            />
            <InfoRow label="Total" value={order.formattedTotal} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Billing & contact</h4>
          <div className="space-y-4">
            <InfoRow label="Name" value={billingName || "—"} />
            {order.billing.companyName && (
              <InfoRow label="Company" value={order.billing.companyName} />
            )}
            <InfoRow
              label="Email"
              value={
                <a href={`mailto:${order.billing.email}`} className="text-primary hover:underline">
                  {order.billing.email}
                </a>
              }
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <h4 className="text-sm font-semibold text-gray-700 m-0">Product details</h4>
            <p className="text-xs text-gray-500 mt-1 m-0">
              {displayItems.length} line item{displayItems.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 w-20">Qty</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((row, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 text-gray-900 font-medium">{row.code}</td>
                    <td className="py-3.5 px-4 text-gray-900">{row.description}</td>
                    <td className="py-3.5 px-4 text-center text-gray-900">{row.quantity}</td>
                    <td className="py-3.5 px-4 text-right text-gray-900">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t-2 border-gray-100 flex justify-end items-center gap-4">
            <span className="text-sm font-semibold text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-900">{order.formattedTotal}</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default OrderDetailDrawer;
