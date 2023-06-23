"use client"
import React, { useEffect, useState, FormEvent, useRef } from "react";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import Logo from "@/components/logo/Logo";
import Link from "next/link";
import "../style.css";
import { useRouter } from "next/navigation";

const Register = () => {

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const email = useRef("");
  const password = useRef("");
  const firstName = useRef("");
  const lastName = useRef("");
  const username = useRef("");

  const router = useRouter();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (email.current.length > 0 && password.current.length > 0 && firstName.current.length > 0 && lastName.current.length > 0 && username.current.length > 0) {
      const response = await addUser();
      if (response.message == "User already exists! Please sign in.") {
        toast.error(response.message);
        return;
      }
      else if(response.message == "Username is already in use. Please choose another username."){
        toast.error(response.message);
        return;
      }
      const signin = await userSignIn();
      if (signin.message == "No user found! Please sign up." || signin.message == "Incorrect password.") {
          toast.error("An error occured.");
          return;
      }
      toast.loading("Signing you in...");
      const result = await signIn("credentials", {
        email: email.current,
        password: password.current,
        callbackUrl: "/chat",
      })
      if (result?.error) {
        toast.error("An error occured.");
      }
      else {
        router.push("/chat");
      }
    }
    else {
      toast.error("Please fill in all fields.");
    }
  }

  const addUser = async () => {
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          action: "addUser",
          email: email.current,
          password: password.current,
          username: username.current,
          firstName: firstName.current,
          lastName: lastName.current,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const userSignIn = async () => {
    try {
        const response = await fetch('/api/database', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                action: "userSignIn",
                email: email.current,
                password: password.current,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

  if (!mounted) return <></>;
  return (
    <div className="auth">
      {/* <Circle></Circle> */}
      <div className="content">
        <Logo></Logo>
        <Toaster></Toaster>
        <div className="authcontent">
          <div className="box">
            <h1>Welcome!</h1>
            <form onSubmit={async (e) => await handleSignIn(e)}>
              <div className="name">
                <input type="text" placeholder="First Name" onChange={(e) => (firstName.current = e.target.value)} />
                <input type="text" placeholder="Last Name" onChange={(e) => (lastName.current = e.target.value)} />
              </div>
              <input type="text" placeholder="Username" onChange={(e) => (username.current = e.target.value)} />
              <input type="email" placeholder="Email" onChange={(e) => (email.current = e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => (password.current = e.target.value)} />
              <button>Register</button>
            </form>
            <p>Need to sign in? <Link href="/auth/signin">Sign in here.</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;