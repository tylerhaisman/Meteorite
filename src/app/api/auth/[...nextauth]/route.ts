import NextAuth from "next-auth/next";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
// const client = require("../../../../PSQL/connection");
const bcrypt = require("bcrypt");
import {
    findFullUser,
  } from "../../database/query";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "email",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string
                };
                // Add logic here to look up the user from the credentials supplied
                const user = await findFullUser(email);

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    const isPasswordValid = bcrypt.compareSync(password, user.password);
                    if (isPasswordValid) {
                        return user;
                    }
                    else {
                        return null;
                    }
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;
                    // throw new Error("No user found!");
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    pages:{
        // signIn: "/auth/signin",
        // newUser: '/auth/register',
        error: '/auth/error',
    }
})

export { handler as GET, handler as POST }; 