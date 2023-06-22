import React, {useState} from "react";
import "./style.css";
import Logo from "../logo/Logo";
import Image from "next/image";
import HamburgerImg from "../../assets/icons/menu.svg";
import Link from "next/link";
import Contacts from "../../assets/icons/contacts.svg";
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from "next-auth/react";

interface HeaderProps {
    toggleRecentsPressed: () => void;
  }

const Header= ({ toggleRecentsPressed }: HeaderProps) => {
    const pathname = usePathname();
    const [visible, setVisible] = useState(true);
    const [contactsVisible, setContactsVisible] = useState(true);

    const handleCheckboxChange = () => {
        setVisible(!visible); // Toggle the visibility state
    };

    // const handleContactsBoxChange = () => {
    //     setContactsVisible(!contactsVisible); // Toggle the visibility state

    // };

    const handleRecentsButtonClick = () => {
        toggleRecentsPressed();
      };

    return ( 
        <div className="header">
            <Logo></Logo>
            <div className="buttons">
                {pathname === "/chat" && <div className="hamburger recent">
                <div className="menu">
                    <input type="checkbox" onChange={handleRecentsButtonClick} />
                    <label className="checkbox-label">
                    <Image src={Contacts} alt="Show contacts menu" width={34} height={34}></Image>
                    </label>
                </div>
                </div>}
            <div className="hamburger">
                <div className="menu">
                    <input type="checkbox" onChange={handleCheckboxChange} />
                    <label className="checkbox-label">
                        <Image className="checkbox-image" src={HamburgerImg} alt="Hamburger menu" width={30} height={30}></Image>
                    </label>
                </div>
                {!visible && (
                    <ul className="options">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/chat">Chat</Link></li>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><Link href="">Help</Link></li>
                        <li className="logout" onClick={() => signOut()}>Sign Out</li>
                    </ul>
                )}
            </div>
            </div>
        </div>
     );
}
 
export default Header;