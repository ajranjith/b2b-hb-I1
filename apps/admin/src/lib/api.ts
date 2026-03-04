import { cookies } from "next/headers";

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!rawApiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

const API_BASE = rawApiBaseUrl.replace(/\/+$/, "");

export async function serverFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
