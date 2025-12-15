import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import AdminDashboard from "./AdminDashboard";

export default async function Page() {
  const cookieStore = await cookies();

  const req: any = { cookies: cookieStore };

  const user = await getCurrentUser(req);

  if (!user || user.role !== "admin") {
    return <p className="text-red-500">Unauthorized - Admin Only</p>;
  }

  return <AdminDashboard user={user} />;
}

