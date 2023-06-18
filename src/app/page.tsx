"use client"
import "./style.css";
import React, { useEffect, FormEvent } from "react";
import Header from "../components/header/Header"
import Image from "next/image";
import Planet from "../assets/images/planet.png"
import Arrow from "../assets/images/arrow.png"
import Link from "next/link";
import Circle from "@/components/cirlce/Circle";
// import { useRouter } from 'next/navigation'
// import { signIn, signOut, useSession } from "next-auth/react"
import SignIn from "@/components/signin/SignIn";

export default function Home() {
  // const router = useRouter()
  // const { data: session } = useSession();

  // if(session && session.user){
  //   return (
  //     <div>{session.user.email}</div>
  //   )
  // }

  // const handleSubmit = async (event: FormEvent) => {
  //   event.preventDefault();
  //   router.push("/api/auth/signin");
  //   const response = await fetch('/api/auth/signin');
  //   const data = await response.json();
  //   console.log(data); // Handle the response data as needed
  // }

  return (
    <div className="home">
      <Circle></Circle>
      <div className="content">
        <Header></Header>
        <div className="cover">
          <div className="title">
            <p className="name">Meteorite Messaging</p>
            <h1>Messaging from another planet.</h1>
            <Link href="/chat"><button>Get Started with Meteorite <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button></Link>
          </div>
          <div className="image">
            <Image src={Planet} alt="Image of another planet" width={700} height={700}></Image>
          </div>
        </div>
      </div>
    </div>
  )
}


// const createTables = async () => {
//   fetch('/api/database', {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json',
//         },
//         body: JSON.stringify({ action: "createTables" }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }

// const addUser = async () => {
//   fetch('/api/database', {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json',
//         },
//         body: JSON.stringify({
//           action: "addUser",
//           email: "tyler@haisman.net",
//           password: "12345",
//           username: "tylerhaisman",
//           firstName: "Tyler",
//           lastName: "Haisman",
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }
// const findUserByEmail = async () => {
//   fetch('/api/database', {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json',
//         },
//         body: JSON.stringify({
//           action: "findUserByEmail",
//           email: "tyler@haisman.net",
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }