import { SignJWT, jwtVerify } from "jose";

export const COOKIE_EMPLOYEE = "employee_token";
export const COOKIE_ADMIN = "admin_token";

export type JwtRole = "ADMIN" | "EMPLOYEE";

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function signEmployeeToken(userId: number) {
  return new SignJWT({ role: "EMPLOYEE" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey());
}

export async function signAdminToken(userId: number) {
  return new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyJwt(token: string): Promise<{
  sub: string;
  role: JwtRole;
}> {
  const { payload } = await jwtVerify(token, secretKey());
  const sub = payload.sub;
  const role = payload.role as JwtRole | undefined;
  if (!sub || (role !== "ADMIN" && role !== "EMPLOYEE")) {
    throw new Error("Invalid token");
  }
  return { sub, role };
}

export const cookieBase = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};
