"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type UserType = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileMenu({
  user,
}: {
  user: UserType | null;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const initial = user.name[0]?.toUpperCase() || "U";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <Avatar onClick={() => setOpen(!open)} className="cursor-pointer">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow border rounded p-3">
          <div
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="cursor-pointer mb-3"
          >
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
