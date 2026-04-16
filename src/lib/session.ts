import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { COOKIE_ADMIN, COOKIE_EMPLOYEE, verifyJwt } from "@/lib/jwt";

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_ADMIN)?.value;
  if (!token) return null;
  try {
    const { sub, role } = await verifyJwt(token);
    if (role !== "ADMIN") return null;
    const user = await prisma.user.findUnique({
      where: { id: Number(sub) },
    });
    if (!user || user.role !== Role.ADMIN) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireEmployee() {
  const store = await cookies();
  const token = store.get(COOKIE_EMPLOYEE)?.value;
  if (!token) return null;
  try {
    const { sub, role } = await verifyJwt(token);
    if (role !== "EMPLOYEE") return null;
    const user = await prisma.user.findUnique({
      where: { id: Number(sub) },
    });
    if (!user || user.role !== Role.EMPLOYEE) return null;
    return user;
  } catch {
    return null;
  }
}
