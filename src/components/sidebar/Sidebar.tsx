import React, {useEffect, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import "./style.css";
import Profile from "../../assets/images/profile.png";
import Logo from "../logo/Logo";
import ChatIcon from "../../assets/icons/chat.svg"
import AccountIcon from "../../assets/icons/account.svg"
import FeedbackIcon from "../../assets/icons/feedback.svg"
import LogoutIcon from "../../assets/icons/logout.svg"
import { signOut } from "next-auth/react";

const Sidebar = () => {
    const router = useRouter()
    const [location, setLocation] = useState("/chat");

    return (
        <div className="sidebar">
            <Logo></Logo>
            <div className="menu">
                <div className={location == "/chat" ? "item selected" : "item"}><Image src={ChatIcon} alt="Chat" width={30} height={30}></Image></div>
                <div className={location == "/profile" ? "item selected" : "item"}><Image src={AccountIcon} alt="Profile" width={30} height={30}></Image></div>
                <div className={location == "/help" ? "item selected" : "item"}><Image src={FeedbackIcon} alt="Help" width={30} height={30}></Image></div>
            </div>
            <div onClick={() => signOut({ callbackUrl: "/"})} className="logout">
                <div className="item"><Image src={LogoutIcon} alt="Logout" width={30} height={30}></Image></div>
            </div>
        </div>
    );
}

export default Sidebar;