"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RegisterForm({ switchToLogin }: any) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Registration failed");
            return;
        }

        alert("Registration successful!");
        switchToLogin(); 
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
};


    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <Label>Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button className="w-full" onClick={register}>
                Register
            </Button>

            <p className="text-sm text-center">
                Already registered?{" "}
                <span className="text-blue-600 cursor-pointer" onClick={switchToLogin}>
                    Login
                </span>
            </p>
        </div>
    );
}
