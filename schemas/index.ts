import * as z from 'zod';

export const LoginSchema = z.object({
   email: z
    .string()
    .trim()
    .email({ message: "Invalid email" })
    .max(30, { message: "Email cannot be more than 20 characters" }),

  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })

})

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .max(30, { message: "Email cannot be more than 20 characters" }),

  password: z
    .string()
    .trim()
    .min(5, { message: "Minimum 5 characters required" })
    .max(12, { message: "Maximum 12 characters allowed" }),

  name: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .max(10, { message: "Username cannot be more than 10 characters" }),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .max(30, { message: "Email cannot be more than 30 characters" }),
})

export const NewPasswordSchema = z.object( {
  password: z
    .string()
    .trim()
    .min(5, { message: "Minimum 5 characters required" })
    .max(12, { message: "Maximum 12 characters allowed" }),
})
