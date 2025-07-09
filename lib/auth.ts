import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { connectionToDatabase } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
           id: "credentials",
           name: "Credentials",
           credentials: {
            identifier: { label: "Email/Username", type: "text" },
            password: { label: "Password", type: "password" }
           },
            async authorize(credentials){
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing email and password")
                }

                try {
                    await connectionToDatabase();
                    const user = await User.findOne({ 
                        $or: [ { email: credentials?.identifier}, { userName: credentials?.identifier} ]
                    });
                    if(!user) throw new Error("No user found with this email or username");

                    const isPasswordCorrect = await bcrypt.compare(credentials?.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    } else{
                      throw new Error("Incorrect Password");
                    }

                } catch (err: any) {
                   throw new Error(err.message || "Something went wrong during authentication");
                };
            },
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })

    ],
    callbacks: {
        async jwt({token, user}){
            if (user) {
                token._id = user._id?.toString();
                token.userName = user?.userName; 
                token.email = user?.email;   
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id?.toString();
                session.user.userName = token.userName;
                session.user.email = token.email;
            }
            return session;
        }
    },
    pages: {
        signIn: "auth/login",
        error: "auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30*24*3600,
    },
    secret: process.env.NEXTAUTH_SECRET
}