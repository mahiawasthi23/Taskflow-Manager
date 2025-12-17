import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser(req);

    if (!session) {
      return NextResponse.json({ loggedIn: false });
    }

    // ✅ ADMIN LOGIN (from env)
    if (session.role === "admin") {
      return NextResponse.json({
        loggedIn: true,
        user: {
          name: "Admin",
          email: session.email,
          role: "admin",
        },
      });
    }

    // ✅ NORMAL USER
    const user = await db
      .select({
        name: users.name,
        email: users.email,
        role: users.role,
        address: users.address,
        mobile: users.mobile,
        gender: users.gender,
      })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      user: user[0],
    });
  } catch (error) {
    return NextResponse.json({ loggedIn: false }, { status: 500 });
  }
}

