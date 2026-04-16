import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireAdmin } from "@/lib/session";
import { sendEmail } from "@/lib/sendEmail";

// ====GET ALL EMPLOYEES========
export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await prisma.user.findMany({
    where: { role: Role.EMPLOYEE },
    orderBy: { id: "asc" },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      profileImg: true,
      dob: true,
      gender: true,
      address: true,
      country: true,
      created_at: true,
      updated_at: true,
    },
  });

  return NextResponse.json(employees);
}

// =====CREATE EMPLOYEE========
export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // extract data
  const firstname = body.firstname?.trim();
  const lastname = body.lastname?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const phone = body.phone?.trim() ?? "";

  const dob = body.dob ? new Date(body.dob) : null;
  const gender = body.gender || null;
  const address = body.address || null;
  const country = body.country || null;
  const profileImg = body.profileImg || null;

  const position = body.position || null;

  // validation
  if (!firstname || !lastname || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Firstname, lastname, email and password (min 6 chars) required" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  try {
    const result = await prisma.$transaction(async (tx) => {

      // create user
      const user = await tx.user.create({
        data: {
          firstname,
          lastname,
          email,
          phone,
          password: hashedPassword,
          role: Role.EMPLOYEE,
          dob,
          gender,
          address,
          country,
          profileImg,
        },
      });

      // create employee
      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          position: position
        },
      });

      return { user, employee };
    });


    await sendEmail(
      email,
      "Your Login Credentials",
      `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <div style="background:#020f43; padding:15px; text-align:center;">
            <img src="https://res.cloudinary.com/dttttfevc/image/upload/v1775718477/rocket-logo_jrgyxa.png" width="150" height="35" />
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#000;">
            
            <h3>Welcome ${firstname} ${lastname}</h3>
            <p>Your employee account has been created. Please log in using these credentials.</p>

            <div style="background:#e6623918; padding:12px; border-radius:6px; margin:15px 0; text-align:center;">
              <p><b>Email:</b> ${email}</p>
              <p><b>Password:</b> ${password}</p>
              <div style="text-align:center; margin:20px 0;">
              <a href="http://localhost:3000/" 
                style="background:#e66239; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">
                Login
              </a>
            </div>
            </div>

            
          </div>
        </div>
      </div>
      `
    );
    console.log("email sends");
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.log("CREATE EMPLOYEE ERROR:", error);

    return NextResponse.json(
      { error: "Email may already be in use or invalid data" },
      { status: 400 }
    );
  }
}