import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import {
  COOKIE_EMPLOYEE,
  cookieBase,
  signEmployeeToken,
} from "@/lib/jwt";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== Role.EMPLOYEE) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signEmployeeToken(user.id);
  const res = NextResponse.json({ ok: true, name: user });
  res.cookies.set(COOKIE_EMPLOYEE, token, {
    ...cookieBase,
    maxAge: 60 * 60 * 24,
  });
  return res;
}
