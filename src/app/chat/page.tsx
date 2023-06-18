"use client"

import React, { useEffect, useState, FormEvent } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import Arrow from "../../assets/icons/arrow3.svg"
import Messages from "@/components/messages/Messages";
import { useSession, getSession } from "next-auth/react"
import Loader from "@/components/loader/Loader";
import Circle from "@/components/cirlce/Circle";
import { useRouter } from "next/navigation";

const Chat = () => {
    //rendering hooks
    const router = useRouter();

    //checking for authentication
    const { data: session, status } = useSession()
    if (status === "loading") {
      return <Loader></Loader>
    }
    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return
    }

    //if user is authenticated
    const sendMessage = (event: FormEvent) => {
        event.preventDefault();
        toast.success("Message sent!");
    }
    return (
        <div className="chat">
            <Circle></Circle>
            <div className="content">
                <Toaster></Toaster>
                <div className="page">
                    <Sidebar></Sidebar>
                    <div className="interface">
                        <div className="chatarea">
                            <Messages></Messages>
                            <form className="messagebar" onSubmit={sendMessage}>
                                <textarea placeholder="Start typing..."></textarea>
                                <button><Image src={Arrow} alt="Send" width={20} height={20}></Image></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;