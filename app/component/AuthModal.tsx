"use client";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ open, onClose }: any) {
    const [mode, setMode] = useState("login");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "login" ? "Login" : "Register"}</DialogTitle>
                </DialogHeader>

                {mode === "login" ? (
                    <LoginForm switchToRegister={() => setMode("register")} />
                ) : (
                    <RegisterForm switchToLogin={() => setMode("login")} />
                )}
            </DialogContent>
        </Dialog>
    );
}
