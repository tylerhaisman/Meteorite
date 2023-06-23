"use client"

import React, { useEffect, useState, FormEvent, ChangeEvent, KeyboardEvent, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import { useSession, getSession, signOut } from "next-auth/react"
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import Profile from "../../assets/images/profile.png"
import Header from "@/components/header/Header";

const Account = () => {
    const router = useRouter();
    const [currentUsername, setCurrentUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [viewportWidth, setViewportWidth] = useState<number>(0);

    useEffect(() => {
      const handleResize = () => {
        setViewportWidth(window.innerWidth);
      };
      setViewportWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    //checking for authentication
    const { data: session, status } = useSession();

    const getUserByEmail = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "findUserByEmail",
                    email: session?.user?.email,
                }),
            });
            const data = await response.json();
            if (data.message == "Error retrieving username.") {
                toast.error("An error occured.");
                return;
            }
            return data.message;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };

    //TODO: CHANGE PASSWORD SEPARATE PAGE AND FUNCTION

    // const handleChangePassword = async () => {
    //     try {
    //         const response = await fetch('/api/database', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 action: "changePassword",
    //                 email: session?.user?.email,
    //                 password: newPassword,
    //             }),
    //         });
    //         const data = await response.json();
    //         if (data.message == "Error changing password.") {
    //             toast.error("An error occured. Please try again later.");
    //             return;
    //         }
    //         toast.success("Password changed.");
    //         return;
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occured. Please try again later.");
    //         throw error;
    //     }
    // }

    const toggleRecentsPressed = () => {
        // N/A
      };

    useEffect(() => {
        const fetch = async () => {
            if (session) {
                const user = await getUserByEmail();
                setFirstName(user.firstname);
                setLastName(user.lastname);
                setCurrentUsername(user.username);
            }
        }
        if (status === "authenticated") {
            fetch();
        }
    }, [session, status])
    if (status === "loading") {
        return <Loader></Loader>
    }
    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return
    }
    return (
        <div className="account">
            <div className="content">
                <Toaster></Toaster>
                {viewportWidth < 900 && <Header toggleRecentsPressed={toggleRecentsPressed}></Header>}
                <div className="page">
                {viewportWidth >= 900 && <Sidebar></Sidebar>}
                    <div className="board">
                        <div className="profileinfo">
                            <h1>My Profile</h1>
                            <div className="info">
                                <Image src={Profile} alt="Your profile picture" width={200} height={200}></Image>
                                <div className="name">
                                    <h1>{firstName} {lastName}</h1>
                                    <h2>@{currentUsername}</h2>
                                </div>
                                <hr />
                                <div className="item">
                                    <h2>Email:</h2>
                                    <p>{session?.user?.email}</p>
                                </div>
                                {/* <div className="item">
                                    <h2>Password:</h2>
                                    <button>Change password</button>
                                </div> */}
                                <hr />
                                <div className="reds">
                                    <button className="red" onClick={() => signOut()}>Sign out</button>
                                    {/* <button className="red">Delete account</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;