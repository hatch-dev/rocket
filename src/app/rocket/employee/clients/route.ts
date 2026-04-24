import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee } from "@/lib/session";

// GET assigned clients for logged-in employee
export async function GET() {
  try {
    console.log("Fetching employee clients...");

    const employee = await requireEmployee();

    if (!employee) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Employee ID:", employee.id);

    // Fetch clients assigned to this employee
    const clients = await prisma.client.findMany({
      where: {
        employees: {
          some: {
            employeeId: employee.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log("Clients fetched:", clients.length);

    return NextResponse.json(clients);

  } catch (error) {
    console.error("ERROR FETCHING CLIENTS:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}