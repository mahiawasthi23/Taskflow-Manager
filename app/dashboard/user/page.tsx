import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import UserDashboard from "./UserDasboard";

export default async function Page() {
  const cookieStore = await cookies();
  const req: any = { cookies: cookieStore };
  const user = await getCurrentUser(req);

  if (!user) {
    return <p className="text-red-500">Unable to load user details</p>;
  }

  return <UserDashboard user={user} />;
}
