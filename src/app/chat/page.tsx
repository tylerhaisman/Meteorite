"use client"

import React, { useEffect, useState, FormEvent } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import Arrow from "../../assets/images/arrow.png"

const Chat = () => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    const updateDimensions = () => {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const sendMessage = (event: FormEvent) => {
        event.preventDefault();
        toast.success("Message sent!");
    }

    return (
        <div className="chat">
            <div className="content">
                <Toaster></Toaster>
                <div className="page">
                    <Sidebar></Sidebar>
                    <div className="interface">
                        <div className="chatarea">
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