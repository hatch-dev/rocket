import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireAdmin } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };


export async function GET(_request: Request, { params }: Params) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || user.role !== Role.EMPLOYEE) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.role !== Role.EMPLOYEE) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: {
    firstname?: string;
    email?: string;
    password?: string;
    phone?: string;
    lastname? :string;
    address? :string;
    gender? :string;
    country? :string;
    dob? :string;
    profileImg? : string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: Prisma.UserUpdateInput = {};

  if (body.firstname !== undefined) data.firstname = body.firstname.trim();
  if (body.email !== undefined) data.email = body.email.trim().toLowerCase();
  if (body.phone !== undefined) data.phone = body.phone.trim();
  if (body.lastname !== undefined) data.lastname = body.lastname.trim();
if (body.address !== undefined) data.address = body.address;
if (body.gender !== undefined) data.gender = body.gender;
if (body.country !== undefined) data.country = body.country;
if (body.dob !== undefined) data.dob = new Date(body.dob);
if (body.profileImg !== undefined) data.profileImg = body.profileImg;
  if (body.password !== undefined && body.password.length > 0) {
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }
    data.password = await hashPassword(body.password);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        country: true,
        gender: true,
        dob: true,
        address: true,
        profileImg: true,
        created_at: true,
        updated_at: true,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Update failed (email may be taken)" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {

      // Step 1: find employee record using userId
      const employee = await tx.employee.findUnique({
        where: { userId: id },
      });

      // Step 2: delete client assignments FIRST
      if (employee) {
        await tx.clientEmployee.deleteMany({
          where: { employeeId: employee.id },
        });
      }

      // Step 3: delete employee
      await tx.employee.deleteMany({
        where: { userId: id },
      });

      // Step 4: delete user
      await tx.user.delete({
        where: { id },
      });

    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.log("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}