import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@inapp.local";
  const plain = process.env.ADMIN_PASSWORD ?? "admin123";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: Role.ADMIN },
      });
      console.log("Updated existing user to ADMIN:", email);
    } else {
      console.log("Admin already exists:", email);
    }
    return;
  }

  const password = await bcrypt.hash(plain, 10);

  await prisma.user.create({
    data: {
      firstname: "Admin",
      lastname: "User",
      email,
      phone: "0000000000",
      password,
      role: Role.ADMIN,
    },
  });

  console.log("Seeded admin user:", email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });