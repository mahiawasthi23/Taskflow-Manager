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
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      setIsLoggedIn(data.loggedIn);
      if (data.loggedIn) setUser(data.user);
    }

    checkLogin();
  }, []);

  return (
    <nav className="w-full border-b p-4 flex justify-between items-center bg-white">
      <h1 className="text-xl font-bold">Task Manager</h1>

      {!isLoggedIn ? (
        <Button onClick={() => setOpenAuth(true)}>Login</Button>
      ) : (
        user && (
          <ProfileMenu
            user={user}
            setUser={setUser} 
          />
        )
      )}

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </nav>
  );
}
