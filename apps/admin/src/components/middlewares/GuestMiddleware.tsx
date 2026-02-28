"use client";

import { type FC, type PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/services/auth";
import NProgress from "nprogress";

const GuestMiddleware: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useProfile();

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isError && data) {
      router.replace("/");
    }
  }, [data, isError, router]);

  if (isLoading) {
    return <div className="min-h-screen w-full bg-white" />;
  }

  if (!isError && data) {
    return null;
  }

  return <>{children}</>;
};

export { GuestMiddleware };
