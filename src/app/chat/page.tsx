"use client"

import React, { useEffect, useState, FormEvent, ChangeEvent, KeyboardEvent, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "./style.css";
import Arrow from "../../assets/icons/arrow3.svg"
import Arrow2 from "../../assets/icons/arrow4.svg"
// import Messages from "@/components/messages/Messages";
import { useSession, getSession } from "next-auth/react"
import Loader from "@/components/loader/Loader";
import Circle from "@/components/cirlce/Circle";
import { useRouter } from "next/navigation";
import ToMessage from "@/components/messages/ToMessage";
import FromMessage from "@/components/messages/FromMessage";
import Plus from "../../assets/icons/plus.svg"
import Profile from "../../assets/images/profile.png"
import Link from "next/link";

type User = {
    username: string;
};

const Chat = () => {
    //rendering hooks
    const router = useRouter();
    const [withUsername, setWithUsername] = useState("");
    const [message, setMessage] = useState<string>("");
    const [currentUsername, setCurrentUsername] = useState("");
    const [allUsernames, setAllUsernames] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [unreadMessages, setUnreadMessages] = useState(false);
    const [lastUsername, setLastUsername] = useState("");

    const [viewportWidth, setViewportWidth] = useState<number>(0);

    useEffect(() => {
      const handleResize = () => {
        setViewportWidth(window.innerWidth);
      };
  
      // Initial width on component mount
      setViewportWidth(window.innerWidth);
  
      // Add event listener to update width on resize
      window.addEventListener("resize", handleResize);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    //checking for authentication
    const { data: session, status } = useSession();

    // const handleSendMessage = async () => {
    //     await sendMessage();
    //     setMessage("");
    // };

    const handleSendMessage = async () => {
        if (message != "") {
            const loadingToast = toast.loading("Sending...");
            try {
                await sendMessage();
                setMessage("");
                toast.success('Message sent!', { id: loadingToast });
            } catch (error) {
                toast.error('Failed to send message', { id: loadingToast });
            }
        }
    };

    const setWithUsernameAndReadMessage = async (username: string) => {
        if (withUsername !== username) {
            setLastUsername(withUsername);
            setWithUsername(username);
            await setMessagesRead();
        }
    };




    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await handleSendMessage();
    };

    const checkKey = async (event: KeyboardEvent) => {
        if (event.key == "Enter" && !event.shiftKey) {
            await handleSendMessage();
        }
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
            if (data.message == "Error retrieving messages.") {
                toast.error("An error occured.");
                return;
            }
            return data;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };

    const getRecents = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "getRecents",
                    email: session?.user?.email,
                }),
            });
            const data = await response.json();
            if (data.message == "Error retrieving recents.") {
                toast.error("An error occured.");
                return;
            }
            return data;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };

    const getAllUsernames = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "getAllUsernames",
                }),
            });
            const data = await response.json();
            if (data.message == "Error retrieving recents.") {
                toast.error("An error occured.");
                return;
            }
            return data;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };

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

    const setMessagesRead = async () => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    action: "setMessagesRead",
                    email: session?.user?.email,
                    withUsername,
                }),
            });
            const data = await response.json();
            if (data.message == "Error reading message.") {
                toast.error("An error occured.");
                return;
            }
            return true;
        } catch (error) {
            console.error(error);
            toast.error("An error occured.");
            throw error;
        }
    };

    type Message = {
        from: string;
        to: string;
        content: string;
        timestamp: string;
        read: boolean;
    };

    type Contact = {
        firstName: string;
        lastName: string;
        username: string;
        unreadMessages: boolean;
    };
    const [sortedMessages, setSortedMessages] = useState<Message[]>([]);
    const [sortedRecents, setSortedRecents] = useState<Contact[]>([]);
    const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

    const pollForNewMessages = async () => {
        const messages = await getMessages();
        console.log(messages);
        setSortedMessages(messages.message);
        const recents = await getRecents();
        setSortedRecents(recents.message);
        const usernames = await getAllUsernames();
        setAllUsernames(usernames.message);
    };


    const startPolling = () => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }

        // Show loading toast
        const loadingToast = toast.loading("Loading messages...");

        const intervalId = setInterval(async () => {
            await pollForNewMessages();

            // Remove loading toast after messages are updated
            toast.dismiss(loadingToast);
        }, 1000);

        setPollingIntervalId(intervalId);
    };


    const stopPolling = () => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
        }
        setPollingIntervalId(null);
    };

    const printMessages = sortedMessages.map((item, pos) => {
        if (item.from === currentUsername && item.to === withUsername) {
            return <ToMessage message={item.content} key={pos} />;
        } else if (item.to === currentUsername && item.from === withUsername) {
            return <FromMessage message={item.content} key={pos} />;
        }
        return null;
    });

    const printRecents = sortedRecents.map((item, pos) => {
        const isUnread = item.unreadMessages && withUsername !== item.username;
        return (
            <li
                className="person"
                onClick={() => setWithUsernameAndReadMessage(item.username)}
                key={pos}
                style={{ backgroundColor: withUsername === item.username ? "#dfdfdf" : "" }}
            >
                {item.username === currentUsername && <p>@{item.username} (me)</p>}
                {item.username !== currentUsername && <p>@{item.username}</p>}
                {isUnread && item.username != lastUsername && <div className="unread"></div>}
            </li>
        );
    });


    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (searchValue != "") {
            const exists = allUsernames.some((obj) => obj.username === searchValue);
            if (!exists) {
                toast.error("No username exists!");
            } else {
                setWithUsernameAndReadMessage(searchValue);
                setSearchValue("");
            }
        }
    };

    useEffect(() => {
        if (withUsername != "") {
            startPolling();
        }
        return () => stopPolling();
    }, [withUsername])

    useEffect(() => {
        const fetch = async () => {
            if (session) {
                const user = await getUserByEmail();
                setFirstName(user.firstname);
                setLastName(user.lastname);
                setCurrentUsername(user.username);
                const recents = await getRecents();
                setSortedRecents(recents.message);
                const usernames = await getAllUsernames();
                setAllUsernames(usernames.message);
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
        <div className="chat">
            {/* <Circle></Circle> */}
            <div className="content">
                <Toaster></Toaster>
                <div className="page">
                    {viewportWidth >= 900 && <Sidebar></Sidebar>}
                    <div className="board">
                        <div className="interface">
                            {withUsername != "" && sortedMessages.length == 0 && currentUsername == withUsername && <div className="chatarea">
                                <div className="nocontact">
                                    <h1 className="quiet">Welcome to your workspace.</h1>
                                    <p>This place is all yours.</p>
                                </div>
                                <form className="messagebar" onSubmit={handleFormSubmit}>
                                    <textarea onKeyDown={checkKey} placeholder="Start typing..." value={message} onChange={handleTextareaChange}></textarea>
                                    <button><Image src={Arrow} alt="Send" width={20} height={20}></Image></button>
                                </form>
                            </div>}
                            {withUsername != "" && sortedMessages.length == 0 && currentUsername != withUsername && <div className="chatarea">
                                <div className="nocontact">
                                    <h1 className="quiet">It's kinda quiet here!</h1>
                                    <p>Send a message to get things started.</p>
                                </div>
                                <form className="messagebar" onSubmit={handleFormSubmit}>
                                    <textarea onKeyDown={checkKey} placeholder="Start typing..." value={message} onChange={handleTextareaChange}></textarea>
                                    <button><Image src={Arrow} alt="Send" width={20} height={20}></Image></button>
                                </form>
                            </div>}
                            {withUsername != "" && <div className="chatarea">
                                <div className="messages">
                                    {printMessages}
                                </div>
                                <form className="messagebar" onSubmit={handleFormSubmit}>
                                    <textarea onKeyDown={checkKey} placeholder="Start typing..." value={message} onChange={handleTextareaChange}></textarea>
                                    <button><Image src={Arrow} alt="Send" width={20} height={20}></Image></button>
                                </form>
                            </div>}
                            {withUsername == "" && <div className="nocontact">
                                <h1>Nothing to see here!</h1>
                                <div onClick={() => searchInputRef.current?.focus()} className="option">
                                    <p>Start a new conversation</p><Image src={Arrow2} alt="Arrow right" width={25} height={25}></Image>
                                </div>
                                <div onClick={() => setWithUsernameAndReadMessage(currentUsername)} className="option">
                                    <p>Go to my workspace</p><Image src={Arrow2} alt="Arrow right" width={25} height={25}></Image>
                                </div>
                                <Link href="https://github.com/tylerhaisman/Meteorite" target="_blank"><div className="option">
                                    <p>Learn how to use Meteorite</p><Image src={Arrow2} alt="Arrow right" width={25} height={25}></Image>
                                </div></Link>
                            </div>}
                        </div>
                        {viewportWidth >= 900 && <hr />}
                        {viewportWidth >= 900 && <div className="recents">
                            <div className="top">
                                <form className="searchbar" onSubmit={handleSearchSubmit}>
                                    <input placeholder="Add username" onChange={handleSearchInputChange} value={searchValue} ref={searchInputRef}></input>
                                    <button><Image src={Plus} alt="Send" width={20} height={20}></Image></button>
                                </form>
                            </div>
                            <div className="middle">
                                <h1>Recents</h1>
                                {sortedRecents.length > 0 && <ul className="people">
                                    {printRecents}
                                </ul>}
                                {sortedRecents.length == 0 && <p>No recents.</p>}
                            </div>
                            <div className="bottom">
                                <button className="newchat" onClick={() => searchInputRef.current?.focus()}>
                                    New Chat <Image src={Plus} alt="Send" width={20} height={20} />
                                </button>
                                <div className="profile">
                                    <Image src={Profile} alt="Your profile picture" width={40} height={40}></Image>
                                    <div className="name">
                                        <h2>{firstName} {lastName}</h2>
                                        <p>@{currentUsername}</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;