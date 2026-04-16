import { NextResponse } from "next/server";
import { COOKIE_ADMIN, cookieBase } from "@/lib/jwt";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, "", {
    ...cookieBase,
    maxAge: 0,
  });
  return res;
}
