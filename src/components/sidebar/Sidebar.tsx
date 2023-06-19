import React, {useEffect, useState} from "react";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'
import "./style.css";
import Profile from "../../assets/images/profile.png";
import Logo from "../logo/Logo";
import ChatIcon from "../../assets/icons/chat.svg"
import AccountIcon from "../../assets/icons/account.svg"
import FeedbackIcon from "../../assets/icons/feedback.svg"
import LogoutIcon from "../../assets/icons/logout.svg"
import { signOut } from "next-auth/react";
import Link from "next/link";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="sidebar">
            <Logo></Logo>
            <div className="menu">
                <Link href="/chat"><div className={pathname == "/chat" ? "item selected" : "item"}><Image src={ChatIcon} alt="Chat" width={30} height={30}></Image><span className="tooltiptext">Chat</span></div></Link>
                <Link href="/profile"><div className={pathname == "/profile" ? "item selected" : "item"}><Image src={AccountIcon} alt="Profile" width={30} height={30}></Image><span className="tooltiptext">Profile</span></div></Link>
                <Link href="https://github.com/tylerhaisman/Meteorite" target="_blank"><div className={pathname == "/help" ? "item selected" : "item"}><Image src={FeedbackIcon} alt="Help" width={30} height={30}></Image><span className="tooltiptext">Info</span></div></Link>
            </div>
            <div onClick={() => signOut({ callbackUrl: "/"})} className="logout">
                <div className="item"><Image src={LogoutIcon} alt="Logout" width={30} height={30}></Image><span className="tooltiptext">Sign Out</span></div>
            </div>
        </div>
    );
}

export default Sidebar;