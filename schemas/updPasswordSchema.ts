import { z } from "zod";

export const passwordSchema = z.object({
    oldPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z .string().min(8, "New password must be at least 8 characters")
}).refine((data) => data.oldPassword !== data.newPassword,
  {
    message: "New password cannot be the same as the current password",
    path: ["newPassword"] // attaches error to the newPassword field
  }
)

// .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
// .regex(/[0-9]/, "New password must contain at least one number")    