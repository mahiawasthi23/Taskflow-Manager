"use client";

import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import ProfileMenu from "./ProfileMenu";
import { Button } from "@/components/ui/button";

type UserType = {
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const [openAuth, setOpenAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!res.ok) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        const data = await res.json();

        if (data.loggedIn && data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    }

    checkLogin();
  }, []);

  return (
    <nav className="w-full border-b p-4 flex justify-between items-center bg-white">
      <h1 className="text-xl font-bold">Task Manager</h1>

      {/* ✅ NEVER BLANK */}
      {isLoggedIn && user ? (
        <ProfileMenu user={user} />
      ) : (
        <Button onClick={() => setOpenAuth(true)}>Login</Button>
      )}

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </nav>
  );
}
