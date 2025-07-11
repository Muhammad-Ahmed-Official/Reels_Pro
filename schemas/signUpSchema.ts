import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    userName: userNameValidation,
    email: z.string(),
    password: z.string().min(6, {message: "Password must be atleast 6 characters"}),
    profilePic: z.string().url(),
})