"use client"

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import Arrow from "../../assets/icons/arrow3.svg"
// import Messages from "@/components/messages/Messages";
import { useSession, getSession } from "next-auth/react"
import Loader from "@/components/loader/Loader";
import Circle from "@/components/cirlce/Circle";
import { useRouter } from "next/navigation";
import ToMessage from "@/components/messages/ToMessage";
import FromMessage from "@/components/messages/FromMessage";

const Chat = () => {
    //rendering hooks
    const router = useRouter();
    const withUsername = "troubleshute";
    const [message, setMessage] = useState<string>("");

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
    const handleSendMessage = async (event: FormEvent) => {
        event.preventDefault();
        toast.loading("Sending...");
        await sendMessage();
        setMessage("");
        toast.remove();
    }
    const sendMessage = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "sendMessage",
                    email: session?.user?.email,
                    withUsername: withUsername,
                    message,
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    }
    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };



    const [sortedMessages, setSortedMessages] = useState([]);
    const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

    const pollForNewMessages = async () => {
        const messages = await getMessages();
        setSortedMessages(messages.message.reverse());
    };

    const startPolling = () => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        const intervalId = setInterval(pollForNewMessages, 1000);
        setPollingIntervalId(intervalId);
    };

    const stopPolling = () => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        setPollingIntervalId(null);
    };

    useEffect(() => {
        startPolling();
        return () => stopPolling();
    }, [withUsername]);

    const printMessages = sortedMessages.map((item, pos) => {

    });

    const getMessages = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "getMessages",
                    email: session?.user?.email,
                    withUsername: withUsername,
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };


    return (
        <div className="chat">
            <Circle></Circle>
            <div className="content">
                <Toaster></Toaster>
                <div className="page">
                    <Sidebar></Sidebar>
                    <div className="interface">
                        <div className="chatarea">
                            <div className="messages">
                                <ToMessage message="Hello world"></ToMessage>
                                <FromMessage message="Hello world"></FromMessage>
                            </div>
                            <form className="messagebar" onSubmit={handleSendMessage}>
                                <textarea placeholder="Start typing..." value={message} onChange={handleTextareaChange}></textarea>
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