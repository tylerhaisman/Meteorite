"use client"
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Arrow from "../../assets/images/arrow.png";
import Link from "next/link";

const SignIn = () => {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className="stuff">
                <Link href="/chat"><button>Get Started with Meteorite <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button></Link>
                {/* <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button> */}

            </div>
        )
    }
    else {
        return (
            <button onClick={() => signIn('credentials', { callbackUrl: '/chat' })}>Get Started with Meteorite <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button>
        )
    }
}

export default SignIn;