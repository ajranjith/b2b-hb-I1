"use client";

import { Tag } from "antd";
import type { OrderStatus } from "./contract";

export interface StatusConfig {
  bg: string;
  color: string;
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, StatusConfig> = {
  CREATED: { bg: "#E6F7D9", color: "#389E0D" },
  PROCESSING: { bg: "#E6F4FF", color: "#1890FF" },
  BACKORDER: { bg: "#FFF7E6", color: "#FA8C16" },
  READY_FOR_SHIPMENT: { bg: "#D9F7BE", color: "#52C41A" },
  FULLFILLED: { bg: "#F0F2F5", color: "#595959" },
  CANCELLED: { bg: "#FFF1F0", color: "#F5222D" },
};

export const getOrderStatusTag = (status: OrderStatus) => {
  const config = ORDER_STATUS_COLORS[status];
  const displayText = status.replace(/_/g, " ");

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
      {displayText}
    </Tag>
  );
};
