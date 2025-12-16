// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";

// type UserType = {
//   name: string;
//   email: string;
//   role: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState("");

//   useEffect(() => {
//     async function fetchUser() {
//       const res = await fetch("/api/auth/me");
//       const data = await res.json();

//       if (data.loggedIn) {
//         setUser(data.user);
//         setName(data.user.name);
//       }
//     }

//     fetchUser();
//   }, []);

//   async function handleSave() {
//     const res = await fetch("/api/auth/update-profile", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name }),
//     });

//     if (res.ok) {
//       const updatedUser = await res.json();
//       setUser(updatedUser);
//       setIsEditing(false);
//     } else {
//       alert("Update failed");
//     }
//   }

//   function handleCancel() {
//     if (user) {
//       setName(user.name);
//     }
//     setIsEditing(false);
//   }

//   if (!user) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="max-w-md mx-auto mt-10 border p-6 rounded bg-white">
//       <h2 className="text-xl font-semibold mb-4">My Profile</h2>

//       {/* Name */}
//       <label className="text-sm">Name</label>
//       <input
//         className="border p-2 w-full rounded mb-4"
//         value={name}
//         disabled={!isEditing}
//         onChange={(e) => setName(e.target.value)}
//       />

//       {/* Email (never editable) */}
//       <label className="text-sm">Email</label>
//       <input
//         className="border p-2 w-full rounded mb-4 bg-gray-100"
//         value={user.email}
//         disabled
//       />

//       {/* Buttons */}
//       {!isEditing ? (
//         <Button className="w-full" onClick={() => setIsEditing(true)}>
//           Edit
//         </Button>
//       ) : (
//         <>
//           <Button className="w-full mb-2" onClick={handleSave}>
//             Save
//           </Button>

//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={handleCancel}
//           >
//             Cancel
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type UserType = {
  name: string;
  email: string;
  role: string;
  address?: string;
  gender?: string;
  mobile?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.loggedIn) {
        setUser(data.user);
        setName(data.user.name);
        setAddress(data.user.address || "");
        setGender(data.user.gender || "");
        setMobile(data.user.mobile || "");
      }
    }

    fetchUser();
  }, []);

  async function handleSave() {
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        gender,
        mobile,
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
    } else {
      alert("Update failed");
    }
  }

  function handleCancel() {
    if (user) {
      setName(user.name);
      setAddress(user.address || "");
      setGender(user.gender || "");
      setMobile(user.mobile || "");
    }
    setIsEditing(false);
  }

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      {/* Name */}
      <label className="text-sm">Name</label>
      <input
        className="border p-2 w-full rounded mb-4"
        value={name}
        disabled={!isEditing}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email (never editable) */}
      <label className="text-sm">Email</label>
      <input
        className="border p-2 w-full rounded mb-4 bg-gray-100"
        value={user.email}
        disabled
      />

      {/* Mobile */}
      <label className="text-sm">Mobile Number</label>
      <input
        className="border p-2 w-full rounded mb-4"
        value={mobile}
        disabled={!isEditing}
        onChange={(e) => setMobile(e.target.value)}
      />

      {/* Gender */}
      <label className="text-sm">Gender</label>
      <select
        className="border p-2 w-full rounded mb-4"
        value={gender}
        disabled={!isEditing}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>

      {/* Address */}
      <label className="text-sm">Address</label>
      <textarea
        className="border p-2 w-full rounded mb-4"
        value={address}
        disabled={!isEditing}
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* Buttons */}
      {!isEditing ? (
        <Button className="w-full" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      ) : (
        <>
          <Button className="w-full mb-2" onClick={handleSave}>
            Save
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
