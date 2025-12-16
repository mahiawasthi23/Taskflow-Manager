import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, encodeSession } from "@/lib/session";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  address: z.string().optional(),
  gender: z.string().optional(),
  mobile: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, address, gender, mobile } = parsed.data;

    await db
      .update(users)
      .set({
        name,
        address,
        gender,
        mobile,
      })
      .where(eq(users.id, user.id));

    const updatedSession = encodeSession({
      userId: user.id,
      role: user.role,
      name,
      email: user.email,
      address,
      gender,
      mobile,
    });

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `taskflow_session=${updatedSession}; Path=/; HttpOnly; SameSite=Lax`
    );

    return new NextResponse(
      JSON.stringify({
        name,
        email: user.email,
        role: user.role,
        address,
        gender,
        mobile,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("[update-profile]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

