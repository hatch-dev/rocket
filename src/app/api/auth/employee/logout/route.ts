import { NextResponse } from "next/server";
import { COOKIE_EMPLOYEE, cookieBase } from "@/lib/jwt";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_EMPLOYEE, "", {
    ...cookieBase,
    maxAge: 0,
  });
  return res;
}
