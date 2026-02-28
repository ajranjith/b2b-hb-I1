"use client";

import { Suspense } from "react";
import { MainLayout } from "../../components/layouts/MainLayout";
import { AuthMiddleware } from "../../components/middlewares";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthMiddleware>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <MainLayout>{children}</MainLayout>
      </Suspense>
    </AuthMiddleware>
  );
}
