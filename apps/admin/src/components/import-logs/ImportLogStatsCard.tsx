"use client";

import type { FC } from "react";

interface ImportLogStatsCardProps {
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
  iconBg?: string;
  icon: React.ReactNode;
}

export const ImportLogStatsCard: FC<ImportLogStatsCardProps> = ({
  title,
  value,
  bgColor,
  textColor,
  iconBg = "bg-white",
  icon,
}) => (
  <div
    className="rounded-xl p-3.5 h-[104px]!"
    style={{ backgroundColor: bgColor }}
  >
    <div className="flex items-center gap-1.5">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        style={{ color: textColor }}
      >
        {icon}
      </div>
      <p className="text-base m-0">{title}</p>
    </div>
    <p
      className="text-[26px] font-semibold tabular-nums mt-1"
      style={{ color: textColor }}
    >
      {value.toLocaleString()}
    </p>
  </div>
);
