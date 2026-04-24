import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  COOKIE_ADMIN,
  COOKIE_EMPLOYEE,
  verifyJwt,
} from "@/lib/jwt";

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const employeeToken = request.cookies.get(COOKIE_EMPLOYEE)?.value;
  const adminToken = request.cookies.get(COOKIE_ADMIN)?.value;

  const verifyEmployee = async () => {
    if (!employeeToken) return false;
    try {
      const p = await verifyJwt(employeeToken);
      return p.role === "EMPLOYEE";
    } catch {
      return false;
    }
  };

  const verifyAdmin = async () => {
    if (!adminToken) return false;
    try {
      const p = await verifyJwt(adminToken);
      return p.role === "ADMIN";
    } catch {
      return false;
    }
  };

  // ——— Public pages ———
  if (pathname === "/") {
    if (await verifyEmployee()) {
      return NextResponse.redirect(new URL("/rocket/employee/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    if (await verifyAdmin()) {
      return NextResponse.redirect(new URL("/rocket/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/rocket/api/auth")) {
    return NextResponse.next();
  }

  // ——— Employee area ———
  if (pathname.startsWith("/rocket/employee")) {
    if (!(await verifyEmployee())) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ——— Admin dashboard & employee APIs ———
  if (pathname.startsWith("/rocket/admin/dashboard") || pathname.startsWith("/rocket/api/employees")) {
    if (!(await verifyAdmin())) {
      return NextResponse.redirect(new URL("/rocket/admin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
