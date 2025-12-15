"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type UserType = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileMenu({
  user,
  setUser,
}: {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}) {
  if (!user) return null;

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  useEffect(() => {
    setFormData({ name: user.name, email: user.email });
  }, [user]);

  const initial = user.name[0]?.toUpperCase() || "U";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  async function handleSave() {
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setIsEditing(false);
      setFormData(updatedUser);
      setUser(updatedUser);
    } else {
      console.error("Update failed");
    }
  }

  return (
    <div className="relative">
      <Avatar onClick={() => setOpen(!open)} className="cursor-pointer">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow border rounded p-3">
          {!isEditing ? (
            <p className="text-sm font-medium">{user.name}</p>
          ) : (
            <input
              className="border p-1 w-full rounded text-sm mb-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          {!isEditing ? (
            <p className="text-xs text-gray-500 mb-2">{user.email}</p>
          ) : (
            <input
              className="border p-1 w-full rounded text-sm mb-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          )}

          {!isEditing ? (
            <Button
              variant="outline"
              className="w-full mb-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button className="w-full mb-2" onClick={handleSave}>
                Save
              </Button>

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email });
                }}
              >
                Cancel
              </Button>
            </>
          )}

          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
