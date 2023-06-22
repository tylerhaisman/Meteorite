"use client"
import "./style.css";
import React, { useEffect, FormEvent } from "react";
import Header from "../components/header/Header"
import Image from "next/image";
import Planet from "../assets/images/planet.png"
import Arrow from "../assets/images/arrow.png"
import Link from "next/link";
import Circle from "@/components/cirlce/Circle";
import Logo from "@/components/logo/Logo";

export default function Home() {
  useEffect(() => {
    const initDatabase = async () => {
      await initializeDatabase();
    }
    initDatabase();
  },[])
  const initializeDatabase = async () => {
    try {
        const response = await fetch('/api/database', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                action: "createTables",
            }),
        });
        const data = await response.json();
        if (data.message == "Error reading message.") {
            console.error("An error occured.");
            return;
        }
        return true;
    } catch (error) {
        console.error(error);
        console.error("An error occured.");
        throw error;
    }
};
  return (
    <div className="home">
      {/* <Circle></Circle> */}
      <div className="content">
        <Logo></Logo>
        <div className="cover">
          <div className="title">
            <p className="name">Meteorite Messaging</p>
            <h1>Messaging. From another planet.</h1>
            <Link href="/chat"><button>Get Started with Meteorite <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button></Link>
          </div>
          <div className="image">
            <Image src={Planet} alt="Image of another planet" width={650} height={650}></Image>
          </div>
        </div>
      </div>
    </div>
  )
}