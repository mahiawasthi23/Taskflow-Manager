import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = createSession({
      userId: 0,               
      role: "admin",
      name: "Admin",
      email
    });

    return NextResponse.json(
      { ok: true, role: "admin" },
      {
        headers: {
          "Set-Cookie": `taskflow_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
        }
      }
    );
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { error: "User not registered" },
      { status: 400 }
    );
  }

  const match = await verifyPassword(password, user.password);
  if (!match) {
    return NextResponse.json(
      { error: "Wrong password" },
      { status: 400 }
    );
  }

  const token = createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  });

  return NextResponse.json(
    { ok: true, role: user.role },
    {
      headers: {
        "Set-Cookie": `taskflow_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      }
    }
  );
}
