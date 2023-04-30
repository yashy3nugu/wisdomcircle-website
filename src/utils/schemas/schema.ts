import { z } from "zod";
import validator from "validator";

export const registerInputSchema = z.object({
  email: z
    .string({ required_error: "Please provide an email address" })
    .email({ message: "Please provide a valid email" }),
  password: z
    .string({ required_error: "Please provide a password" })
    .min(8, "password must contain atleast 8 characters"),
  firstName: z.string({ required_error: "Please provide your first name" }),
  lastName: z.string({ required_error: "Please provide your last name" }),
  mobile: z
    .string({ required_error: "Please provide your mobile number" })
    .refine(validator.isMobilePhone, "Please provide a valid mobile number"),
  countryCode: z.string({required_error: "Please provide a country code"})
});

export const loginInputSchema = z.object({
  emailOrMobile: z.union([
    z
      .string({ required_error: "Please provide your email or phone number" })
      .email({ message: "Please provide a valid email address" }),
    z
      .string({ required_error: "Please provide your email or phone number" })
      .refine(validator.isMobilePhone, "Please provide a valid mobile number"),
  ]).refine(() => null, "aa"),
  password: z.string({
    required_error: "Please provide your password",
  }),
});

export const verifyTokenInpuSchema = z.object({
  token: z.string(),
});

export const sendPasswordRecoveryMailInputSchema = z.object({
  email: z
    .string({ required_error: "Please provide your email or phone number" })
    .email({ message: "Please provide a valid email address" }),
});

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string({ required_error: "Please provide a password" })
      .min(8, "password must contain atleast 8 characters"),
    confirmPassword: z
      .string({ required_error: "Please provide a password" })
      .min(8, "password must contain atleast 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sorry! Passwords is not matching",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string({ required_error: "Please provide a password" })
    .min(8, "password must contain atleast 8 characters"),
});
