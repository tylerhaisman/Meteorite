import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const bcrypt = require("bcrypt");
import {
    findFullUser,
  } from "../../database/query";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string
                };
                const user = await findFullUser(email);

                if (user) {
                    const isPasswordValid = bcrypt.compareSync(password, user.password);
                    if (isPasswordValid) {
                        return user;
                    }
                    else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        })
    ],
    pages:{
        signIn: '/auth/signin',
        newUser: '/auth/register',
        error: '/auth/error',
    }
})

export { handler as GET, handler as POST }; 