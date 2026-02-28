import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/",
  "/dealers",
  "/products",
  "/order-logs",
  "/backorders",
  "/user-management",
  "/import-logs",
  "/content-management",
];
const authPaths = ["/login"];

export function middleware(request: NextRequest) {
  // const token =
  //   request.cookies.get("auth_token") ?? request.cookies.get("connect.sid");
  // const { pathname } = request.nextUrl;

  // const isProtected =
  //   pathname === "/" ||
  //   protectedPaths.some((p) => pathname.startsWith(p));
  // const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // if (isProtected && !token && !pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  // if (isAuthPage && token) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
