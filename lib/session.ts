import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

function encodeSession(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

function decodeSession(str?: string | null): any | null {
  if (!str) return null;

  try {
    return JSON.parse(Buffer.from(str, "base64").toString());
  } catch {
    return null;
  }
}

function createSession(payload: {
  userId: number;
  role: string;
  name: string;
  email: string;
}): string {
  return encodeSession(payload);
}

function getSessionFromRequest(req: NextRequest) {
  const cookie = req.cookies.get("taskflow_session")?.value || null;
  return decodeSession(cookie);
}

function clearSession(headers: Headers) {
  headers.append(
    "Set-Cookie",
    "taskflow_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
}

export async function getCurrentUser(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session || session.userId === undefined || session.userId === null) {
    return null;
  }

  if (session.role === "admin") {
    return {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: "admin",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user) return null;

  return user;
}

export {
  encodeSession,
  decodeSession,
  createSession,
  getSessionFromRequest,
  clearSession,
};
