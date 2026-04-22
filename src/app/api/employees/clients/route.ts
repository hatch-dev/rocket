import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee } from "@/lib/session"; // or your auth method

export async function GET() {

  const employeeUser = await requireEmployee();

  if (!employeeUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    // Step 1: find employee
    const employee = await prisma.employee.findUnique({
      where: {
        userId: employeeUser.id
      }
    });

    if (!employee) {
      return NextResponse.json([]);
    }

    // Step 2: get assigned clients
    const clientEmployees = await prisma.clientEmployee.findMany({
      where: {
        employeeId: employee.id
      },
      include: {
        client: true
      }
    });

    // Step 3: return only clients
    const clients = clientEmployees.map(c => c.client);

    return NextResponse.json(clients);

  } catch (error) {

    console.log("EMPLOYEE CLIENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}