"use client";

import { GuestMiddleware } from "../../components/middlewares";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestMiddleware>{children}</GuestMiddleware>;
}
