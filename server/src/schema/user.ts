import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be 3 or more characters long" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

export const LoginSchema = RegisterSchema.omit({ name: true });
