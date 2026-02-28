"use client";

import { Tag } from "antd";
import type { ImportStatus } from "./contract";

const IMPORT_STATUS_CONFIG: Record<
  ImportStatus,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "#FFF7E6", color: "#FA8C16", label: "Pending" },
  PROCESSING: { bg: "#E6F4FF", color: "#1890FF", label: "Processing" },
  COMPLETED: { bg: "#E6F7D9", color: "#389E0D", label: "Completed" },
  FAILED: { bg: "#FFF1F0", color: "#F5222D", label: "Failed" },
};

export const getImportLogStatusTag = (status: ImportStatus) => {
  const config = IMPORT_STATUS_CONFIG[status];
  if (!config) return null;
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
      {config.label}
    </Tag>
  );
};
