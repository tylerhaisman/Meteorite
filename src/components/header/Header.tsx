import React, {useState} from "react";
import "./style.css";
import Logo from "../logo/Logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HamburgerImg from "../../assets/images/hamburger.png";
import Link from "next/link";


const Header = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(true);
    const handleCheckboxChange = () => {
        setVisible(!visible); // Toggle the visibility state
    };

    return ( 
        <div className="header">
            <Logo></Logo>
            <div className="buttons">
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
                    </ul>
                )}
            </div>
            </div>
        </div>
     );
}
 
export default Header;