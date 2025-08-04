import { z } from "zod";

export const messageSchema = z.object({
    message: z.string().min(1, {message: "Message is required"}),
    image: z.string().url({message: "Image URL must be a valid URL"}),
})