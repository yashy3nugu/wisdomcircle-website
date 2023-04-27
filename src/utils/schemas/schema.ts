import { z } from "zod";

export const registerInputSchema = z.object({
  email: z
    .string({ required_error: "user must provide their email" })
    .email({ message: "please provide a valid email" }),
  password: z
    .string({ required_error: "user must provide a password" })
    .min(6, "password must contain atleast 6 characters"),
  firstName: z.string({ required_error: "user must provide their first name" }),
  lastName: z.string({ required_error: "user must provide their last name" }),
  mobile: z
    .string({ required_error: "user must provide their mobile number" })
    .min(10),
});
