import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee } from "@/lib/session"; 

export async function GET() {
  try {
    //  get logged-in USER
    const user = await requireEmployee();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  get EMPLOYEE record (IMPORTANT FIX)
    const employee = await prisma.employee.findUnique({
      where: {
        userId: user.id, 
      },
    });
    if (!employee) {
      return NextResponse.json({ employee: null, clients: [] });
    }

    // get assigned clients using employee.id
    const clientRelations = await prisma.clientEmployee.findMany({
      where: {
        employeeId: employee.id, 
      },
      include: {
        client: true,
      },
    });
    const clients = clientRelations.map((c) => c.client);
    return NextResponse.json({
      employee: user,  
      clients,
    });

  } catch (error) {
    console.log("EMPLOYEE ME ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}