"use client"
import React, { useEffect, useState, FormEvent, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Toast, toast, Toaster } from "react-hot-toast";
import Logo from "@/components/logo/Logo";
import Link from "next/link";
import "../style.css";
import Circle from "@/components/cirlce/Circle";
import { useRouter } from "next/navigation";

const Login = () => {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const email = useRef("");
    const password = useRef("");

    const router = useRouter();

    // const handleSignIn = async (e: FormEvent) => {
    //     e.preventDefault();
    //     const result = await signIn("credentials", {
    //         email: email.current,
    //         password: password.current,
    //         redirect: true,
    //         callbackUrl: "/chat",
    //     })
    // }

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        if (email.current.length > 0 && password.current.length > 0) {
            const response = await userSignIn();
            if (response.message == "No user found! Please sign up.") {
                toast.error(response.message);
                return;
            }
            else if (response.message == "Incorrect password."){
                toast.error(response.message);
                return;
            }
            toast.loading("Signing you in...");
            const result = await signIn("credentials", {
                email: email.current,
                password: password.current,
                callbackUrl: "/chat",
            })
            if (result?.error) {
                toast.error("Username or password is incorrect.");
            }
            else {
                router.push("/chat");
            }
        }
        else {
            toast.error("Please fill in all fields.");
        }
    }

    const userSignIn = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "userSignIn",
                    email: email.current,
                    password: password.current,
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    if (!mounted) return <></>;
    return (
        <div className="auth">
            <Circle></Circle>
            <div className="content">
                <Logo></Logo>
                <Toaster></Toaster>
                <div className="authcontent">
                    <div className="box">
                        <h1>Sign In</h1>
                        <form onSubmit={async (e) => await handleSignIn(e)}>
                            <input type="email" placeholder="Email" onChange={(e) => (email.current = e.target.value)} />
                            <input type="password" placeholder="Password" onChange={(e) => (password.current = e.target.value)} />
                            <button>Sign In</button>
                        </form>
                        <p>New to Meteorite? <Link href="/auth/register">Register here.</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;