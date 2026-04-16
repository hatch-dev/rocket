import { EmployeeRocketDashboard } from "@/components/dashboard/EmployeeRocketDashboard";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireEmployee } from "@/lib/session";

async function getData() {
  const user = await requireEmployee();

  if (!user) {
    console.log("No user found");
    return { clients: [], employee: null };
  }

  console.log("User:", user);

  // Fetch actual employee using userId
  const employee = await prisma.employee.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  console.log("Employee record:", employee);

  if (!employee) {
    console.log("Employee not found for user");
    return { clients: [], employee: null };
  }

  // Fetch assigned clients using correct employee.id
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

  console.log("Clients fetched:", clients);

  return {
    clients,
      employee: {
        id: employee.id,
        userId: employee.userId,
        firstname: employee.user.firstname,
        lastname: employee.user.lastname,
        email: employee.user.email,
        profileImg: employee.user.profileImg,
      },
  };
}
export const metadata: Metadata = {
  title: "Employee dashboard",
};

export default async function EmployeeDashboardPage() {
  const { clients, employee } = await getData();

  return (
    <EmployeeRocketDashboard 
      clients={clients} 
      employee={employee} 
    />
  );
}