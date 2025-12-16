import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = getSessionFromRequest(req);

  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      gender: user.gender,
      mobile: user.mobile,
    },
  });
}

