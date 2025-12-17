import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createSession({
        userId: 0,
        role: "admin",
        name: "Admin",
        email,
      });

      return NextResponse.json(
        { ok: true, role: "admin" },
        {
          headers: {
            "Set-Cookie": `taskflow_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
          },
        }
      );
    }


    const user = await findUserByEmail(email);
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not registered" },
        { status: 400 }
      );
    }

    if (!user.password) {
      console.error("User password hash missing!");
      return NextResponse.json(
        { error: "User password not set. Contact admin." },
        { status: 500 }
      );
    }

    console.log("User password hash:", user.password);

    const isMatch = await verifyPassword(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 400 }
      );
    }

   
    const token = createSession({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json(
      { ok: true, role: user.role },
      {
        headers: {
          "Set-Cookie": `taskflow_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      }
    );
  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error.message, error.stack);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

