import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; 
import { users } from "@/db/schema"; 
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  email: z.string().email("Invalid email address"),
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
        { error: "Invalid input", details: parsed.error.issues},
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;


    await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, user.id));

    return NextResponse.json({ name, email });
  } catch (error) {
    console.error("[update-profile]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
